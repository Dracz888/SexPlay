import { BASE_CARDS } from '../data/cards';
import type { Level, PlayCard, Player } from '../types';
import { LEVELS } from '../types';

export interface DeckSource {
  /** id de categoría o de sub-interruptor -> permitido. */
  limits: Record<string, boolean>;
  disabledCardIds: string[];
  customCards: PlayCard[];
}

/** Todas las cartas que existen: las del mazo base más las que creó la pareja. */
export function allCards(customCards: PlayCard[]): PlayCard[] {
  return [...BASE_CARDS, ...customCards];
}

/** ¿Esta carta pasa los límites que eligió la pareja? */
export function isAllowed(card: PlayCard, limits: Record<string, boolean>): boolean {
  if (!limits[card.category]) return false;
  return (card.tags ?? []).every((tag) => limits[tag]);
}

/** ¿Esta carta tiene sentido para quién juega el turno y para su pareja? */
export function fitsPlayers(card: PlayCard, actor: Player, target: Player): boolean {
  if (card.actorGender && card.actorGender !== actor.gender) return false;
  if (card.targetGender && card.targetGender !== target.gender) return false;
  return true;
}

/** Cartas que pueden salir en la partida: permitidas y no eliminadas. */
export function buildAvailableCards({ limits, disabledCardIds, customCards }: DeckSource): PlayCard[] {
  const disabled = new Set(disabledCardIds);
  return allCards(customCards).filter((card) => !disabled.has(card.id) && isAllowed(card, limits));
}

/** Cuántas cartas hay para cada nivel con los límites actuales. */
export function countByLevel(available: PlayCard[], actor: Player, target: Player): Record<Level, number> {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<Level, number>;
  for (const card of available) {
    if (fitsPlayers(card, actor, target)) counts[card.level] += 1;
  }
  return counts;
}

export interface DrawResult {
  card: PlayCard;
  /** Nivel del que finalmente salió la carta (puede no ser el pedido). */
  level: Level;
  /** Bolsas de cartas ya usadas, actualizadas. */
  usedByBag: Record<string, string[]>;
  /** Aviso cuando hubo que cambiar de nivel o rebarajar. */
  notice: string | null;
}

/**
 * Saca una carta del nivel pedido sin repetir hasta agotar la bolsa de ese nivel.
 * Si con los límites elegidos ese nivel se quedó sin cartas, cae al nivel más cercano
 * que sí tenga y lo avisa.
 */
export function drawCard(
  available: PlayCard[],
  wantedLevel: Level,
  actor: Player,
  target: Player,
  usedByBag: Record<string, string[]>,
  random: () => number = Math.random,
): DrawResult | null {
  const forPlayers = available.filter((card) => fitsPlayers(card, actor, target));

  const level = nearestLevelWithCards(forPlayers, wantedLevel);
  if (level === null) return null;

  const pool = forPlayers.filter((card) => card.level === level);
  const bagKey = `n${level}`;
  const used = new Set(usedByBag[bagKey] ?? []);

  let notice: string | null = level === wantedLevel ? null : `No quedan cartas de nivel ${wantedLevel} con sus límites. Sale una de nivel ${level}.`;

  let candidates = pool.filter((card) => !used.has(card.id));
  let nextUsed: string[];

  if (candidates.length === 0) {
    // Se acabó la bolsa: se rebaraja y vuelven a entrar todas.
    candidates = pool;
    nextUsed = [];
    notice ??= 'Se acabaron las cartas de este nivel. Volvemos a barajarlas.';
  } else {
    nextUsed = usedByBag[bagKey] ?? [];
  }

  const card = candidates[Math.floor(random() * candidates.length)];

  return {
    card,
    level,
    usedByBag: { ...usedByBag, [bagKey]: [...nextUsed, card.id] },
    notice,
  };
}

/** Busca el nivel con cartas más cercano al pedido (primero hacia abajo, luego hacia arriba). */
function nearestLevelWithCards(cards: PlayCard[], wanted: Level): Level | null {
  const withCards = new Set(cards.map((card) => card.level));
  if (withCards.has(wanted)) return wanted;

  const byDistance = LEVELS.filter((level) => withCards.has(level)).sort((a, b) => {
    const diff = Math.abs(a - wanted) - Math.abs(b - wanted);
    return diff !== 0 ? diff : a - b;
  });

  return byDistance[0] ?? null;
}
