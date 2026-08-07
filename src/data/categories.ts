import type { Category } from '../types';

/**
 * Las categorías son a la vez la lista de límites y la organización del mazo.
 * Si una categoría está apagada, ninguna de sus cartas sale nunca.
 */
export const CATEGORIES: Category[] = [
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

/** Todos los interruptores de la lista: categorías + sus sub-opciones. */
export const ALL_LIMIT_IDS: string[] = CATEGORIES.flatMap((c) => [
  c.id,
  ...(c.extras ?? []).map((e) => e.id),
]);

export function categoryLabel(id: string): string {
  return CATEGORY_BY_ID[id]?.label ?? id;
}
