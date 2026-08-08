import type { PlayCard } from '../../types';
import { anal } from './anal';
import { ataduras } from './ataduras';
import { axilas } from './axilas';
import { azotes } from './azotes';
import { besos } from './besos';
import { comida } from './comida';
import { cuerpo } from './cuerpo';
import { dirtytalk } from './dirtytalk';
import { dominacion } from './dominacion';
import { fantasias } from './fantasias';
import { fiesta } from './fiesta';
import { fotos } from './fotos';
import { juguetes } from './juguetes';
import { lenceria } from './lenceria';
import { licor } from './licor';
import { lugares } from './lugares';
import { masajes } from './masajes';
import { masturbacion } from './masturbacion';
import { oral } from './oral';
import { pies } from './pies';
import { sensorial } from './sensorial';
import { sexo } from './sexo';
import { striptease } from './striptease';

/** El mazo base completo. Las cartas de la pareja se suman a esto en tiempo de ejecución. */
export const BASE_CARDS: PlayCard[] = [
  ...fiesta,
  ...besos,
  ...cuerpo,
  ...oral,
  ...anal,
  ...axilas,
  ...pies,
  ...ataduras,
  ...juguetes,
  ...azotes,
  ...dominacion,
  ...sensorial,
  ...dirtytalk,
  ...striptease,
  ...masturbacion,
  ...lenceria,
  ...fotos,
  ...masajes,
  ...comida,
  ...lugares,
  ...fantasias,
  ...sexo,
  ...licor,
];
