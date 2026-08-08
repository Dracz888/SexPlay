/** Tipos compartidos por toda la app. */

export type Gender = 'hombre' | 'mujer';

export type CardType = 'pregunta' | 'reto';

export type Level = 1 | 2 | 3 | 4 | 5;

export const LEVELS: Level[] = [1, 2, 3, 4, 5];

/** Pareja: dos personas fijas. Fiesta: tres o más y el juego reparte a quién le toca. */
export type GameMode = 'pareja' | 'fiesta';

export const MODES: GameMode[] = ['pareja', 'fiesta'];

/**
 * Cómo se reparte con quién te toca en el modo Fiesta:
 *   hetero -> solo te puede tocar con alguien del sexo opuesto.
 *   mix    -> te puede tocar con cualquiera.
 */
export type Pairing = 'hetero' | 'mix';

/** En Fiesta hay tantos jugadores como quieran, así que el id es libre. */
export type PlayerId = string;

/** Cuánta gente admite una partida de Fiesta. */
export const MIN_PARTY_PLAYERS = 3;
export const MAX_PARTY_PLAYERS = 12;

export interface Player {
  id: PlayerId;
  name: string;
  gender: Gender;
  intimidad: number;
}

/** Sub-interruptor dentro de una categoría, para lo más sensible. */
export interface CategoryExtra {
  id: string;
  label: string;
}

export interface Category {
  id: string;
  label: string;
  /** Descripción corta que se ve en la lista de límites. */
  hint: string;
  extras?: CategoryExtra[];
  /** Sus cartas solo salen en el modo Fiesta: hablan de más de dos personas. */
  partyOnly?: boolean;
}

export interface PlayCard {
  id: string;
  category: string;
  type: CardType;
  level: Level;
  /** Admite {actor}, {pareja}, {otro}, {otro2}, {a}, {p}, {o} y {o2} (ver engine/text.ts). */
  text: string;
  /** Ids de sub-interruptores que deben estar permitidos para que salga. */
  tags?: string[];
  /** La carta solo sale si quien juega el turno es de este género. */
  actorGender?: Gender;
  /** La carta solo sale si a quien le toca es de este género. */
  targetGender?: Gender;
  /** Gente mínima en la mesa, contando a quien juega. Se usa cuando el texto no los nombra. */
  minPlayers?: number;
  /** La carta solo sale con este reparto (por ejemplo, solo en Mix). */
  pairing?: Pairing;
  custom?: boolean;
}

export interface ShopItem {
  id: string;
  title: string;
  description: string;
  cost: number;
  custom?: boolean;
}

export interface Voucher {
  /** Identificador único del vale comprado. */
  id: string;
  itemId: string;
  ownerId: PlayerId;
  boughtAt: number;
  usedAt?: number;
}

/** Lo que está pasando ahora mismo en la mesa. */
export type TurnPhase = 'listo' | 'dado' | 'carta' | 'intimidad';

export interface Session {
  mode: GameMode;
  /** Solo cuenta en Fiesta; en Pareja siempre es 'mix'. */
  pairing: Pairing;
  players: Player[];
  level: Level;
  turn: PlayerId;
  phase: TurnPhase;
  /** Última tirada del dado (null en nivel 1, que no tira). */
  roll: number | null;
  card: PlayCard | null;
  /** A quién le tocó con la carta actual: [0] es {pareja}, [1] {otro} y [2] {otro2}. */
  cast: PlayerId[];
  /** Cartas ya usadas en esta partida, por bolsa "nivel-tipo". */
  usedByBag: Record<string, string[]>;
  vouchers: Voucher[];
  turnCount: number;
  /** Aviso cuando no quedan cartas del nivel exacto que salió. */
  notice: string | null;
}

/** Todo lo que se guarda en el teléfono. */
export interface PersistedState {
  version: number;
  onboardingDone: boolean;
  /** id de categoría o de sub-interruptor -> permitido. */
  limits: Record<string, boolean>;
  /** Ids de cartas base ocultadas por la pareja. */
  disabledCardIds: string[];
  customCards: PlayCard[];
  customShopItems: ShopItem[];
  disabledShopItemIds: string[];
  lastPlayers: [Player, Player] | null;
  /** La gente de la última fiesta, para no volver a escribir los nombres. */
  lastPartyPlayers: Player[] | null;
  lastPairing: Pairing;
  session: Session | null;
}
