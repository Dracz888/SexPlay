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

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialState();

    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    const base = initialState();

    return {
      ...base,
      ...parsed,
      version: VERSION,
      // Si en una versión nueva aparecen categorías, entran apagadas sin romper lo guardado.
      limits: { ...base.limits, ...(parsed.limits ?? {}) },
    };
  } catch {
    return initialState();
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
