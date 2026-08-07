import type { Level } from '../types';

export interface RollResult {
  /** Caras del dado que se lanzó. 0 en nivel 1, que no tira. */
  faces: number;
  /** Número que salió (1 en nivel 1, donde no hay tirada). */
  value: number;
  /** Nivel de la carta que toca. null cuando el resultado fue Intimidad. */
  cardLevel: Level | null;
  /** true cuando salió 6 en el nivel 5: en vez de carta, se gana Intimidad. */
  intimacy: boolean;
}

/** Cuántas caras tiene el dado en cada nivel. En nivel 5 el dado es de 6. */
export function facesForLevel(level: Level): number {
  return level === 1 ? 0 : level === 5 ? 6 : level;
}

/**
 * Nivel 1: no se tira, siempre sale carta de nivel 1.
 * Niveles 2 a 4: dado de tantas caras como el nivel; lo que salga es el nivel de la carta.
 * Nivel 5: dado de 6 caras; del 1 al 5 es el nivel de la carta y el 6 da Intimidad.
 */
export function rollForLevel(level: Level, random: () => number = Math.random): RollResult {
  const faces = facesForLevel(level);

  if (faces === 0) {
    return { faces: 0, value: 1, cardLevel: 1, intimacy: false };
  }

  const value = Math.floor(random() * faces) + 1;

  if (level === 5 && value === 6) {
    return { faces, value, cardLevel: null, intimacy: true };
  }

  return { faces, value, cardLevel: value as Level, intimacy: false };
}

/** Cuánta Intimidad da cada 6. */
export const INTIMACY_PER_SIX = 1;
