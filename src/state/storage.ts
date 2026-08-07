import { ALL_LIMIT_IDS } from '../data/categories';
import type { PersistedState, Player } from '../types';

const KEY = 'sexplay:v1';
const VERSION = 1;

export const DEFAULT_PLAYERS: [Player, Player] = [
  { id: 'p1', name: 'Él', gender: 'hombre', intimidad: 0 },
  { id: 'p2', name: 'Ella', gender: 'mujer', intimidad: 0 },
];

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
    session: null,
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
