import { ALL_LIMIT_IDS } from '../data/categories';
import type { Gender, PersistedState, Player, Session } from '../types';
import { MIN_PARTY_PLAYERS } from '../types';

const KEY = 'sexplay:v1';
const VERSION = 2;

export const DEFAULT_PLAYERS: [Player, Player] = [
  { id: 'p1', name: 'Él', gender: 'hombre', intimidad: 0 },
  { id: 'p2', name: 'Ella', gender: 'mujer', intimidad: 0 },
];

/** Un invitado nuevo y vacío, listo para que le pongan nombre. */
export function newPartyPlayer(gender: Gender = 'hombre'): Player {
  return {
    id: `j-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    name: '',
    gender,
    intimidad: 0,
  };
}

/** Gente de arranque para una fiesta: la pareja de siempre más los invitados que falten. */
export function defaultPartyPlayers(): Player[] {
  const base = DEFAULT_PLAYERS.map((p) => ({ ...p, name: '' }));
  const faltan = Math.max(0, MIN_PARTY_PLAYERS - base.length);
  return [...base, ...Array.from({ length: faltan }, (_, i) => newPartyPlayer(i % 2 === 0 ? 'hombre' : 'mujer'))];
}

/** Todo empieza apagado: la pareja marca lo que sí quiere. */
export function emptyLimits(): Record<string, boolean> {
  return Object.fromEntries(ALL_LIMIT_IDS.map((id) => [id, false]));
}

export function allLimitsOn(): Record<string, boolean> {
  return Object.fromEntries(ALL_LIMIT_IDS.map((id) => [id, true]));
}

export function initialState(): PersistedState {
  return {
    version: VERSION,
    onboardingDone: false,
    limits: emptyLimits(),
    disabledCardIds: [],
    customCards: [],
    customShopItems: [],
    disabledShopItemIds: [],
    lastPlayers: null,
    lastPartyPlayers: null,
    lastPairing: 'mix',
    session: null,
  };
}

/**
 * Pone al día una partida guardada con una versión anterior de la app,
 * que todavía no sabía nada de modos ni de fiestas.
 */
function normalizeSession(session: Partial<Session> | null | undefined): Session | null {
  if (!session || !Array.isArray(session.players) || session.players.length < 2) return null;

  const players = session.players as Player[];
  const turn = players.some((p) => p.id === session.turn) ? session.turn! : players[0].id;

  return {
    mode: session.mode === 'fiesta' ? 'fiesta' : 'pareja',
    pairing: session.pairing === 'hetero' ? 'hetero' : 'mix',
    players,
    level: session.level ?? 1,
    turn,
    phase: session.phase ?? 'listo',
    roll: session.roll ?? null,
    card: session.card ?? null,
    // Las partidas viejas no guardaban a quién le tocaba: en pareja siempre era el otro.
    cast: session.cast?.length
      ? session.cast
      : players.filter((p) => p.id !== turn).slice(0, 1).map((p) => p.id),
    usedByBag: session.usedByBag ?? {},
    vouchers: session.vouchers ?? [],
    turnCount: session.turnCount ?? 0,
    notice: session.notice ?? null,
  };
}

/** Completa lo que falte con los valores por defecto, venga de donde venga. */
export function normalizeState(parsed: Partial<PersistedState>): PersistedState {
  const base = initialState();

  return {
    ...base,
    ...parsed,
    version: VERSION,
    // Si en una versión nueva aparecen categorías, entran apagadas sin romper lo guardado.
    limits: { ...base.limits, ...(parsed.limits ?? {}) },
    lastPairing: parsed.lastPairing === 'hetero' ? 'hetero' : 'mix',
    session: normalizeSession(parsed.session),
  };
}

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialState();
    return normalizeState(JSON.parse(raw) as Partial<PersistedState>);
  } catch {
    return initialState();
  }
}

/** Nombre del archivo de copia de seguridad, con la fecha de hoy. */
export function backupFileName(): string {
  return `sexplay-${new Date().toISOString().slice(0, 10)}.json`;
}

/**
 * Lee un archivo exportado. Devuelve null si no es una copia de SexPlay,
 * para no machacar los datos buenos con un archivo cualquiera.
 */
export function parseBackup(texto: string): PersistedState | null {
  try {
    const parsed: unknown = JSON.parse(texto);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;

    const datos = parsed as Partial<PersistedState>;
    const pareceSexPlay =
      typeof datos.limits === 'object' ||
      Array.isArray(datos.customCards) ||
      Array.isArray(datos.disabledCardIds);

    return pareceSexPlay ? normalizeState(datos) : null;
  } catch {
    return null;
  }
}

export function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Si el almacenamiento está lleno o bloqueado, la partida sigue igual en memoria.
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nada que hacer.
  }
}
