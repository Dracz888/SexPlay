import type { CardType, Level, PlayCard } from '../../types';

type Extra = Pick<PlayCard, 'tags' | 'actorGender' | 'targetGender' | 'minPlayers' | 'pairing'>;

/**
 * Cada carta se escribe como [nivel, texto] o [nivel, texto, { tags, actorGender, ... }].
 * En el texto puedes usar {actor}, {pareja}, {otro}, {otro2} y sus terminaciones
 * {a}, {p}, {o} y {o2} (ver engine/text.ts).
 */
export type Entry = [Level, string] | [Level, string, Extra];

/** Arma las cartas de una categoría y les pone id automáticamente. */
export function deck(category: string, preguntas: Entry[], retos: Entry[]): PlayCard[] {
  const build = (type: CardType, prefix: string, entries: Entry[]): PlayCard[] =>
    entries.map(([level, text, extra], i) => ({
      id: `${category}-${prefix}${i + 1}`,
      category,
      type,
      level,
      text,
      ...extra,
    }));

  return [...build('pregunta', 'p', preguntas), ...build('reto', 'r', retos)];
}
