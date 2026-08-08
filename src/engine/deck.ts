import { BASE_CARDS } from '../data/cards';
import { PARTY_ONLY_CATEGORIES } from '../data/categories';
import type { GameMode, Level, Pairing, PlayCard, Player } from '../types';
import { LEVELS } from '../types';

export interface DeckSource {
  /** id de categoría o de sub-interruptor -> permitido. */
  limits: Record<string, boolean>;
  disabledCardIds: string[];
  customCards: PlayCard[];
}

/** Con quién se está jugando ahora mismo: hace falta para saber qué cartas encajan. */
export interface Table {
  mode: GameMode;
  pairing: Pairing;
  players: Player[];
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

/**
 * Cuánta gente nombra la carta además de quien juega:
 * 1 con solo {pareja}, 2 si además usa {otro} y 3 si también usa {otro2}.
 */
export function castSize(card: PlayCard): number {
  if (card.text.includes('{otro2}') || card.text.includes('{o2}')) return 3;
  if (card.text.includes('{otro}') || card.text.includes('{o}')) return 2;
  return 1;
}

/** Gente mínima en la mesa para que la carta tenga sentido, contando a quien juega. */
export function minPlayersFor(card: PlayCard): number {
  return Math.max(card.minPlayers ?? 0, castSize(card) + 1);
}

/** ¿Con quién le puede tocar a esta persona? En hetero, solo con el sexo opuesto. */
export function partnersFor(actor: Player, table: Table): Player[] {
  const otros = table.players.filter((p) => p.id !== actor.id);
  if (table.mode !== 'fiesta' || table.pairing !== 'hetero') return otros;
  return otros.filter((p) => p.gender !== actor.gender);
}

/** ¿Esta carta cabe en esta mesa, con este modo y este reparto? */
export function fitsMode(card: PlayCard, table: Table): boolean {
  if (PARTY_ONLY_CATEGORIES.has(card.category) && table.mode !== 'fiesta') return false;
  if (table.mode === 'fiesta' && card.pairing && card.pairing !== table.pairing) return false;
  return table.players.length >= minPlayersFor(card);
}

/** ¿Esta carta tiene sentido para quién juega el turno y para quien le toque? */
export function fitsPlayers(card: PlayCard, actor: Player, table: Table): boolean {
  if (card.actorGender && card.actorGender !== actor.gender) return false;
  if (!fitsMode(card, table)) return false;

  const posibles = partnersFor(actor, table);
  if (posibles.length < castSize(card)) return false;
  if (card.targetGender && !posibles.some((p) => p.gender === card.targetGender)) return false;

  return true;
}

/** Cartas que pueden salir en la partida: permitidas y no eliminadas. */
export function buildAvailableCards({ limits, disabledCardIds, customCards }: DeckSource): PlayCard[] {
  const disabled = new Set(disabledCardIds);
  return allCards(customCards).filter((card) => !disabled.has(card.id) && isAllowed(card, limits));
}

/** Cuántas cartas hay para cada nivel con los límites actuales. */
export function countByLevel(available: PlayCard[], actor: Player, table: Table): Record<Level, number> {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<Level, number>;
  for (const card of available) {
    if (fitsPlayers(card, actor, table)) counts[card.level] += 1;
  }
  return counts;
}

export interface DrawResult {
  card: PlayCard;
  /** Nivel del que finalmente salió la carta (puede no ser el pedido). */
  level: Level;
  /** A quién le tocó: [{pareja}, {otro}, {otro2}], en ese orden. */
  cast: Player[];
  /** Bolsas de cartas ya usadas, actualizadas. */
  usedByBag: Record<string, string[]>;
  /** Aviso cuando hubo que cambiar de nivel o rebarajar. */
  notice: string | null;
}

/** Reparte a quién le toca con esta carta. Devuelve null si la mesa no da. */
export function chooseCast(
  card: PlayCard,
  actor: Player,
  table: Table,
  random: () => number = Math.random,
): Player[] | null {
  const size = castSize(card);
  const pool = shuffle(partnersFor(actor, table), random);
  if (pool.length < size) return null;

  const indice = card.targetGender
    ? pool.findIndex((p) => p.gender === card.targetGender)
    : 0;
  if (indice === -1) return null;

  const target = pool[indice];
  const resto = pool.filter((p) => p.id !== target.id).slice(0, size - 1);

  return [target, ...resto];
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
  table: Table,
  usedByBag: Record<string, string[]>,
  random: () => number = Math.random,
): DrawResult | null {
  const forPlayers = available.filter((card) => fitsPlayers(card, actor, table));

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
  const cast = chooseCast(card, actor, table, random);
  if (!cast) return null;

  return {
    card,
    level,
    cast,
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

/** Baraja una copia de la lista, sin tocar la original. */
function shuffle<T>(items: T[], random: () => number): T[] {
  const copia = [...items];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}
