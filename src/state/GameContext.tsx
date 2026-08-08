import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import { allCategories } from '../data/categories';
import { buildAvailableCards } from '../engine/deck';
import type { DrawResult } from '../engine/deck';
import { INTIMACY_PER_SIX } from '../engine/dice';
import type { RollResult } from '../engine/dice';
import type {
  Category,
  GameMode,
  Level,
  Pairing,
  PersistedState,
  PlayCard,
  Player,
  PlayerId,
  ShopItem,
} from '../types';
import { allLimitsOn, clearState, emptyLimits, initialState, loadState, saveState } from './storage';

export type Action =
  | { type: 'limits/set'; ids: string[]; value: boolean }
  | { type: 'limits/allowAll' }
  | { type: 'limits/clearAll' }
  | { type: 'onboarding/done' }
  | { type: 'game/start'; mode: GameMode; pairing: Pairing; players: Player[] }
  | { type: 'game/setLevel'; level: Level }
  | { type: 'game/rolled'; roll: RollResult; draw: DrawResult | null }
  | { type: 'game/endTurn' }
  | { type: 'game/finish' }
  | { type: 'shop/buy'; item: ShopItem; playerId: PlayerId }
  | { type: 'shop/redeem'; voucherId: string }
  | { type: 'cards/toggleDisabled'; cardId: string }
  | { type: 'cards/save'; card: PlayCard }
  | { type: 'cards/deleteCustom'; cardId: string }
  | { type: 'categories/save'; category: Category }
  | { type: 'categories/deleteCustom'; categoryId: string }
  | { type: 'shopItems/save'; item: ShopItem }
  | { type: 'shopItems/toggleDisabled'; itemId: string }
  | { type: 'shopItems/deleteCustom'; itemId: string }
  | { type: 'data/import'; state: PersistedState }
  | { type: 'data/reset' };

/** A quién le toca después: se va rotando en el orden en que se apuntaron. */
const nextTurn = (players: Player[], id: PlayerId): PlayerId => {
  const indice = players.findIndex((p) => p.id === id);
  return players[(indice + 1) % players.length].id;
};

export function reducer(state: PersistedState, action: Action): PersistedState {
  switch (action.type) {
    case 'limits/set': {
      const limits = { ...state.limits };
      for (const id of action.ids) limits[id] = action.value;
      // Apagar una categoría apaga también sus sub-opciones.
      return { ...state, limits };
    }

    case 'limits/allowAll':
      return { ...state, limits: allLimitsOn(state.customCategories) };

    case 'limits/clearAll':
      return { ...state, limits: emptyLimits(state.customCategories) };

    case 'onboarding/done':
      return { ...state, onboardingDone: true };

    case 'game/start': {
      const players = action.players.map((p) => ({ ...p, intimidad: 0 }));
      const enPareja = action.mode === 'pareja';

      return {
        ...state,
        lastPlayers: enPareja ? ([players[0], players[1]] as [Player, Player]) : state.lastPlayers,
        lastPartyPlayers: enPareja ? state.lastPartyPlayers : players,
        lastPairing: action.pairing,
        session: {
          mode: action.mode,
          pairing: enPareja ? 'mix' : action.pairing,
          players,
          level: 1,
          turn: players[0].id,
          phase: 'listo',
          roll: null,
          card: null,
          cast: [],
          usedByBag: {},
          vouchers: [],
          turnCount: 0,
          notice: null,
        },
      };
    }

    case 'game/setLevel':
      if (!state.session) return state;
      return { ...state, session: { ...state.session, level: action.level } };

    case 'game/rolled': {
      const s = state.session;
      if (!s) return state;

      if (action.roll.intimacy) {
        const players = s.players.map((p) =>
          p.id === s.turn ? { ...p, intimidad: p.intimidad + INTIMACY_PER_SIX } : p,
        );
        return {
          ...state,
          session: {
            ...s,
            players,
            phase: 'intimidad',
            roll: action.roll.value,
            card: null,
            cast: [],
            notice: null,
          },
        };
      }

      if (!action.draw) {
        return {
          ...state,
          session: {
            ...s,
            phase: 'listo',
            roll: action.roll.value,
            card: null,
            cast: [],
            notice:
              s.mode === 'fiesta'
                ? 'No hay ninguna carta que encaje con los límites y con la gente que hay en la mesa. Revisen la lista en Configuración o cambien el reparto.'
                : 'No hay ninguna carta disponible con los límites que eligieron. Revisen la lista en Configuración.',
          },
        };
      }

      return {
        ...state,
        session: {
          ...s,
          phase: 'carta',
          roll: action.roll.value,
          card: action.draw.card,
          cast: action.draw.cast.map((p) => p.id),
          usedByBag: action.draw.usedByBag,
          notice: action.draw.notice,
        },
      };
    }

    case 'game/endTurn': {
      const s = state.session;
      if (!s) return state;
      return {
        ...state,
        session: {
          ...s,
          turn: nextTurn(s.players, s.turn),
          phase: 'listo',
          roll: null,
          card: null,
          cast: [],
          notice: null,
          turnCount: s.turnCount + 1,
        },
      };
    }

    case 'game/finish': {
      const s = state.session;
      if (!s) return { ...state, session: null };

      const limpios = s.players.map((p) => ({ ...p, intimidad: 0 }));
      return {
        ...state,
        lastPlayers:
          s.mode === 'pareja' ? ([limpios[0], limpios[1]] as [Player, Player]) : state.lastPlayers,
        lastPartyPlayers: s.mode === 'fiesta' ? limpios : state.lastPartyPlayers,
        session: null,
      };
    }

    case 'shop/buy': {
      const s = state.session;
      if (!s) return state;
      const buyer = s.players.find((p) => p.id === action.playerId);
      if (!buyer || buyer.intimidad < action.item.cost) return state;

      const players = s.players.map((p) =>
        p.id === action.playerId ? { ...p, intimidad: p.intimidad - action.item.cost } : p,
      ) as [Player, Player];

      return {
        ...state,
        session: {
          ...s,
          players,
          vouchers: [
            ...s.vouchers,
            {
              id: `v-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              itemId: action.item.id,
              ownerId: action.playerId,
              boughtAt: Date.now(),
            },
          ],
        },
      };
    }

    case 'shop/redeem': {
      const s = state.session;
      if (!s) return state;
      return {
        ...state,
        session: {
          ...s,
          vouchers: s.vouchers.map((v) => (v.id === action.voucherId ? { ...v, usedAt: Date.now() } : v)),
        },
      };
    }

    case 'cards/toggleDisabled': {
      const disabled = state.disabledCardIds.includes(action.cardId)
        ? state.disabledCardIds.filter((id) => id !== action.cardId)
        : [...state.disabledCardIds, action.cardId];
      return { ...state, disabledCardIds: disabled };
    }

    case 'cards/save': {
      const exists = state.customCards.some((c) => c.id === action.card.id);
      return {
        ...state,
        customCards: exists
          ? state.customCards.map((c) => (c.id === action.card.id ? action.card : c))
          : [...state.customCards, action.card],
      };
    }

    case 'cards/deleteCustom':
      return {
        ...state,
        customCards: state.customCards.filter((c) => c.id !== action.cardId),
        disabledCardIds: state.disabledCardIds.filter((id) => id !== action.cardId),
      };

    case 'categories/save': {
      const existe = state.customCategories.some((c) => c.id === action.category.id);
      return {
        ...state,
        customCategories: existe
          ? state.customCategories.map((c) => (c.id === action.category.id ? action.category : c))
          : [...state.customCategories, action.category],
        // Una categoría recién creada entra permitida: si no, sus cartas no saldrían nunca.
        limits: existe ? state.limits : { ...state.limits, [action.category.id]: true },
      };
    }

    case 'categories/deleteCustom': {
      // Se van con ella las cartas que vivían dentro: ya no tendrían dónde estar.
      const suyas = new Set(
        state.customCards.filter((c) => c.category === action.categoryId).map((c) => c.id),
      );
      const limits = { ...state.limits };
      delete limits[action.categoryId];

      return {
        ...state,
        customCategories: state.customCategories.filter((c) => c.id !== action.categoryId),
        customCards: state.customCards.filter((c) => !suyas.has(c.id)),
        disabledCardIds: state.disabledCardIds.filter((id) => !suyas.has(id)),
        limits,
      };
    }

    case 'shopItems/save': {
      const exists = state.customShopItems.some((i) => i.id === action.item.id);
      return {
        ...state,
        customShopItems: exists
          ? state.customShopItems.map((i) => (i.id === action.item.id ? action.item : i))
          : [...state.customShopItems, action.item],
      };
    }

    case 'shopItems/toggleDisabled': {
      const disabled = state.disabledShopItemIds.includes(action.itemId)
        ? state.disabledShopItemIds.filter((id) => id !== action.itemId)
        : [...state.disabledShopItemIds, action.itemId];
      return { ...state, disabledShopItemIds: disabled };
    }

    case 'shopItems/deleteCustom':
      return {
        ...state,
        customShopItems: state.customShopItems.filter((i) => i.id !== action.itemId),
        disabledShopItemIds: state.disabledShopItemIds.filter((id) => id !== action.itemId),
      };

    case 'data/import':
      return action.state;

    case 'data/reset':
      clearState();
      return initialState();

    default:
      return state;
  }
}

interface GameContextValue {
  state: PersistedState;
  dispatch: Dispatch<Action>;
  /** Cartas que pueden salir con los límites y las eliminaciones actuales. */
  availableCards: PlayCard[];
  /** Las categorías de la app más las que creó la pareja. */
  categories: Category[];
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const availableCards = useMemo(
    () =>
      buildAvailableCards({
        limits: state.limits,
        disabledCardIds: state.disabledCardIds,
        customCards: state.customCards,
      }),
    [state.limits, state.disabledCardIds, state.customCards],
  );

  const categories = useMemo(() => allCategories(state.customCategories), [state.customCategories]);

  const value = useMemo(
    () => ({ state, dispatch, availableCards, categories }),
    [state, availableCards, categories],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame debe usarse dentro de <GameProvider>');
  return ctx;
}
