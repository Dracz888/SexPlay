import type { ShopItem } from '../types';

/**
 * La Intimidad se gana sacando un 6 en el dado de nivel 5 (+1 por cada 6).
 * Comprar una solicitud guarda un vale que se canjea cuando quieran: la pareja
 * está obligada a cumplirlo. Los precios se pueden ajustar libremente aquí.
 */
export const BASE_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'shop-elegir-carta',
    title: 'Tú eliges la carta',
    description: 'Descarta la carta que salga y elige tú qué pregunta o reto le toca a tu pareja.',
    cost: 1,
  },
  {
    id: 'shop-saltar',
    title: 'Sálvate de un reto',
    description: 'Tu pareja tiene que cumplir un reto que tú no quisiste hacer.',
    cost: 1,
  },
  {
    id: 'shop-repetir',
    title: 'Otra vez',
    description: 'Tu pareja repite el último reto que hizo, esta vez el doble de tiempo.',
    cost: 2,
  },
  {
    id: 'shop-beso',
    title: 'Un beso donde yo diga',
    description: 'Señalas una parte de tu cuerpo y tu pareja la besa durante un minuto.',
    cost: 2,
  },
  {
    id: 'shop-prenda',
    title: 'Fuera esa prenda',
    description: 'Tu pareja se quita la prenda que tú elijas y no se la vuelve a poner.',
    cost: 2,
  },
  {
    id: 'shop-masaje',
    title: 'Masaje completo',
    description: 'Diez minutos de masaje con aceite, donde tú digas y sin prisa.',
    cost: 3,
  },
  {
    id: 'shop-baile',
    title: 'Baila para mí',
    description: 'Tu pareja te hace un striptease de una canción entera. Tú solo miras.',
    cost: 4,
  },
  {
    id: 'shop-oral',
    title: 'Cinco minutos de boca',
    description: 'Cinco minutos de sexo oral sin que tú tengas que hacer nada.',
    cost: 5,
  },
  {
    id: 'shop-turno',
    title: 'Un turno obedeciendo',
    description: 'Durante un turno completo tu pareja hace todo lo que le ordenes, sin discutir.',
    cost: 6,
  },
  {
    id: 'shop-fantasia',
    title: 'Mi fantasía, hoy',
    description: 'Eliges una fantasía tuya de la lista y tu pareja la cumple esta noche.',
    cost: 8,
  },
  {
    id: 'shop-noche',
    title: 'La noche a mi manera',
    description: 'El resto de la noche se hace todo como tú quieras: posturas, ritmo y final.',
    cost: 10,
  },
];
