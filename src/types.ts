/** Tipos compartidos por toda la app. */

export type Gender = 'hombre' | 'mujer';

export type CardType = 'pregunta' | 'reto';

export type Level = 1 | 2 | 3 | 4 | 5;

export const LEVELS: Level[] = [1, 2, 3, 4, 5];

export type PlayerId = 'p1' | 'p2';

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
}

export interface PlayCard {
  id: string;
  category: string;
  type: CardType;
  level: Level;
  /** Admite {actor}, {pareja}, {a} y {p} (ver engine/text.ts). */
  text: string;
  /** Ids de sub-interruptores que deben estar permitidos para que salga. */
  tags?: string[];
  /** La carta solo sale si quien juega el turno es de este género. */
  actorGender?: Gender;
  /** La carta solo sale si la pareja es de este género. */
  targetGender?: Gender;
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
  players: [Player, Player];
  level: Level;
  turn: PlayerId;
  phase: TurnPhase;
  /** Última tirada del dado (null en nivel 1, que no tira). */
  roll: number | null;
  card: PlayCard | null;
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
  session: Session | null;
}
