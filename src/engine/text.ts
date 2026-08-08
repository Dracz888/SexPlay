import type { Player } from '../types';

/** Marcadores que se pueden escribir en el texto de una carta. */
export const TEXT_MARKS = ['{actor}', '{pareja}', '{otro}', '{otro2}', '{a}', '{p}', '{o}', '{o2}'];

const suffix = (player: Player | undefined): string => (player?.gender === 'mujer' ? 'a' : 'o');

/**
 * Rellena el texto de una carta:
 *   {actor}  -> nombre de quien tiene el turno
 *   {pareja} -> nombre de a quien le tocó (en Fiesta lo reparte el juego)
 *   {otro}   -> una tercera persona de la mesa
 *   {otro2}  -> una cuarta persona de la mesa
 *   {a}      -> 'o' u 'a' según el género de quien tiene el turno
 *   {p}      -> 'o' u 'a' según el género de {pareja}
 *   {o}      -> 'o' u 'a' según el género de {otro}
 *   {o2}     -> 'o' u 'a' según el género de {otro2}
 *
 * `cast` viene en el mismo orden: [{pareja}, {otro}, {otro2}].
 */
export function fillCardText(text: string, actor: Player, cast: Player[]): string {
  const [pareja, otro, otro2] = cast;

  return text
    .replace(/\{actor\}/g, actor.name)
    .replace(/\{pareja\}/g, pareja?.name ?? 'tu pareja')
    .replace(/\{otro2\}/g, otro2?.name ?? 'alguien más')
    .replace(/\{otro\}/g, otro?.name ?? 'alguien más')
    .replace(/\{a\}/g, suffix(actor))
    .replace(/\{p\}/g, suffix(pareja))
    .replace(/\{o2\}/g, suffix(otro2))
    .replace(/\{o\}/g, suffix(otro));
}

/** Texto sin nombres, para las pantallas de configuración. */
export function previewCardText(text: string): string {
  return text
    .replace(/\{actor\}/g, 'tú')
    .replace(/\{pareja\}/g, 'quien te toque')
    .replace(/\{otro2\}/g, 'una cuarta persona')
    .replace(/\{otro\}/g, 'una tercera persona')
    .replace(/\{a\}/g, 'o')
    .replace(/\{p\}/g, 'a')
    .replace(/\{o2\}/g, 'a')
    .replace(/\{o\}/g, 'a');
}
