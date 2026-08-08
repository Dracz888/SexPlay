import type { Category } from '../types';
import { MAX_CATEGORY_HINT, MAX_CATEGORY_LABEL } from '../types';

/**
 * Las categorías son a la vez la lista de límites y la organización del mazo.
 * Si una categoría está apagada, ninguna de sus cartas sale nunca.
 * Estas son las que trae la app; la pareja puede añadir las suyas (customCategories).
 */
export const CATEGORIES: Category[] = [
  {
    id: 'fiesta',
    label: 'Fiesta',
    hint: 'Solo en modo Fiesta: retos y preguntas para el grupo, con tres personas o más.',
    partyOnly: true,
    extras: [
      { id: 'fiesta.besos', label: 'Besos entre invitados (beso de tres)' },
      { id: 'fiesta.desnudo', label: 'Desnudarse delante del grupo' },
      { id: 'fiesta.masturbacion', label: 'Masturbarse delante de todos' },
      { id: 'fiesta.cruzado', label: 'Contacto entre parejas distintas' },
      { id: 'fiesta.sexo', label: 'Sexo delante del grupo' },
    ],
  },
  {
    id: 'besos',
    label: 'Besos y caricias',
    hint: 'Besos en la boca, el cuello, la oreja; caricias por encima y por debajo de la ropa.',
  },
  {
    id: 'cuerpo',
    label: 'Manoseo y cuerpo',
    hint: 'Pechos, nalgas, muslos, cuello. Manos por todas partes.',
    extras: [{ id: 'cuerpo.chupetones', label: 'Dejar chupetones' }],
  },
  {
    id: 'oral',
    label: 'Sexo oral',
    hint: 'Boca y lengua en los genitales, dar y recibir.',
    extras: [
      { id: 'oral.garganta', label: 'Garganta profunda' },
      { id: 'oral.acabar_boca', label: 'Acabar en la boca' },
    ],
  },
  {
    id: 'anal',
    label: 'Anal',
    hint: 'Dedos, lengua y penetración anal.',
    extras: [
      { id: 'anal.lengua', label: 'Beso negro (lengua)' },
      { id: 'anal.penetracion', label: 'Penetración anal' },
    ],
  },
  {
    id: 'axilas',
    label: 'Axilas',
    hint: 'Besar, lamer y oler las axilas de tu pareja.',
  },
  {
    id: 'pies',
    label: 'Pies',
    hint: 'Masajes, besos, lamer los pies y usarlos para dar placer.',
  },
  {
    id: 'ataduras',
    label: 'Ataduras',
    hint: 'Amarrar manos y pies con cintas, cuerdas o esposas.',
    extras: [
      { id: 'ataduras.mordaza', label: 'Mordaza' },
      { id: 'ataduras.colgado', label: 'Ataduras a la cama o a un mueble' },
    ],
  },
  {
    id: 'juguetes',
    label: 'Dildos y juguetes',
    hint: 'Dildos, vibradores, plugs, anillos y todo lo que tengan en el cajón.',
    extras: [{ id: 'juguetes.plug', label: 'Plug anal' }],
  },
  {
    id: 'azotes',
    label: 'Azotes y nalgadas',
    hint: 'Nalgadas con la mano, con el cinturón o con lo que decidan.',
    extras: [{ id: 'azotes.objetos', label: 'Azotar con objetos (cinturón, paleta)' }],
  },
  {
    id: 'dominacion',
    label: 'Dominación y sumisión',
    hint: 'Uno manda y el otro obedece: órdenes, castigos, collar, arrodillarse.',
    extras: [
      { id: 'dominacion.humillacion', label: 'Humillación con palabras' },
      { id: 'dominacion.collar', label: 'Collar y correa' },
    ],
  },
  {
    id: 'sensorial',
    label: 'Sensorial',
    hint: 'Vendas en los ojos, hielo, cera, plumas, seda, temperaturas.',
    extras: [{ id: 'sensorial.cera', label: 'Cera caliente' }],
  },
  {
    id: 'dirtytalk',
    label: 'Dirty talk y gemidos',
    hint: 'Hablar sucio, gemir a propósito, decir en voz alta lo que quieren.',
  },
  {
    id: 'striptease',
    label: 'Striptease y baile',
    hint: 'Bailar, desnudarse despacio, sentarse encima, lap dance.',
  },
  {
    id: 'masturbacion',
    label: 'Masturbación',
    hint: 'Tocarse uno mismo, tocarse mirándose, y masturbarse el uno al otro.',
    extras: [{ id: 'masturbacion.mirar', label: 'Masturbarse mientras el otro mira' }],
  },
  {
    id: 'lenceria',
    label: 'Lencería y ropa',
    hint: 'Lencería, ropa interior, quedarse en ropa, quitársela por partes.',
    extras: [{ id: 'lenceria.cruzada', label: 'Ponerse la ropa del otro' }],
  },
  {
    id: 'fotos',
    label: 'Fotos y video',
    hint: 'Fotos subidas de tono y video, solo entre ustedes y en su teléfono.',
    extras: [{ id: 'fotos.video', label: 'Grabar video' }],
  },
  {
    id: 'masajes',
    label: 'Masajes y aceites',
    hint: 'Aceite, manos por toda la espalda y donde haga falta.',
  },
  {
    id: 'comida',
    label: 'Comida y sabores',
    hint: 'Chocolate, crema, hielo, frutas y licor sobre el cuerpo.',
  },
  {
    id: 'lugares',
    label: 'Lugares y riesgo',
    hint: 'Fuera de la cama: cocina, ducha, balcón, carro. Riesgo de que los escuchen.',
    extras: [{ id: 'lugares.exterior', label: 'Fuera de casa (carro, balcón)' }],
  },
  {
    id: 'fantasias',
    label: 'Fantasías y confesiones',
    hint: 'Contar lo que nunca han dicho: fantasías, gustos culposos, secretos.',
    extras: [{ id: 'fantasias.terceros', label: 'Fantasías con terceros' }],
  },
  {
    id: 'sexo',
    label: 'Sexo',
    hint: 'Penetración, posiciones, ritmo y cómo terminar.',
    extras: [
      { id: 'sexo.acabar_cuerpo', label: 'Acabar sobre el cuerpo' },
      { id: 'sexo.control_orgasmo', label: 'Control del orgasmo (parar y seguir)' },
    ],
  },
  {
    id: 'licor',
    label: 'Licor',
    hint: 'Retos de bebida: shots, castigos y tragos compartidos. Solo si van a tomar.',
  },
];

export const CATEGORY_BY_ID: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
);

/** Categorías cuyas cartas solo salen en el modo Fiesta. */
export const PARTY_ONLY_CATEGORIES: Set<string> = new Set(
  CATEGORIES.filter((c) => c.partyOnly).map((c) => c.id),
);

/** Las de la app más las que creó la pareja, en ese orden. */
export function allCategories(custom: Category[] = []): Category[] {
  return [...CATEGORIES, ...custom];
}

/** Las que se ven en la lista de límites de una partida de este modo. */
export function categoriesForMode(mode: 'pareja' | 'fiesta', custom: Category[] = []): Category[] {
  const todas = allCategories(custom);
  return mode === 'fiesta' ? todas : todas.filter((c) => !c.partyOnly);
}

/** Todos los interruptores de una lista: las categorías + sus sub-opciones. */
export function limitIdsFor(categories: Category[]): string[] {
  return categories.flatMap((c) => [c.id, ...(c.extras ?? []).map((e) => e.id)]);
}

/** Los interruptores de las categorías que trae la app. */
export const ALL_LIMIT_IDS: string[] = limitIdsFor(CATEGORIES);

export function categoryLabel(id: string, custom: Category[] = []): string {
  return CATEGORY_BY_ID[id]?.label ?? custom.find((c) => c.id === id)?.label ?? id;
}

/** Prefijo de las categorías propias, para que nunca choquen con las de la app. */
const PREFIJO_PROPIA = 'propia-';

/** "Juegos de agua" -> "juegos-de-agua", sin acentos ni signos raros. */
function slug(label: string): string {
  return label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Id libre para una categoría nueva: legible y sin repetir ninguno de los que ya hay. */
export function newCategoryId(label: string, custom: Category[] = []): string {
  const usados = new Set(allCategories(custom).map((c) => c.id));
  const base = PREFIJO_PROPIA + (slug(label) || 'categoria');

  let id = base;
  let n = 2;
  while (usados.has(id)) id = `${base}-${n++}`;

  return id;
}

/** Recorta y limpia lo que escribió la pareja antes de guardarlo. */
export function cleanCategoryLabel(label: string): string {
  return label.trim().replace(/\s+/g, ' ').slice(0, MAX_CATEGORY_LABEL);
}

export function cleanCategoryHint(hint: string): string {
  return hint.trim().replace(/\s+/g, ' ').slice(0, MAX_CATEGORY_HINT);
}

/** Descripción de relleno para las categorías propias que no traen una. */
export const DEFAULT_CATEGORY_HINT = 'Categoría suya: aquí van las cartas que ustedes creen.';
