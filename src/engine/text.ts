import type { Player } from '../types';

/**
 * Rellena el texto de una carta:
 *   {actor}  -> nombre de quien tiene el turno
 *   {pareja} -> nombre del otro jugador
 *   {a}      -> 'o' u 'a' según el género de quien tiene el turno
 *   {p}      -> 'o' u 'a' según el género del otro jugador
 */
export function fillCardText(text: string, actor: Player, target: Player): string {
  return text
    .replace(/\{actor\}/g, actor.name)
    .replace(/\{pareja\}/g, target.name)
    .replace(/\{a\}/g, actor.gender === 'mujer' ? 'a' : 'o')
    .replace(/\{p\}/g, target.gender === 'mujer' ? 'a' : 'o');
}

/** Texto sin nombres, para las pantallas de configuración. */
export function previewCardText(text: string): string {
  return text
    .replace(/\{actor\}/g, 'tú')
    .replace(/\{pareja\}/g, 'tu pareja')
    .replace(/\{a\}/g, 'o')
    .replace(/\{p\}/g, 'a');
}
