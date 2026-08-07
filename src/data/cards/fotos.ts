import { deck } from './_deck';

export const fotos = deck(
  'fotos',
  [
    [1, 'Pregúntale a {pareja} cuál es la foto tuya que más veces ha mirado.'],
    [2, 'Pregúntale a {pareja} si tiene fotos tuyas guardadas que no le hayas visto.'],
    [2, 'Pregúntale a {pareja} si alguna vez te mandó una foto y se arrepintió a los dos segundos.'],
    [3, 'Pregúntale a {pareja} qué foto suya te mandaría si supiera que la borras al verla.'],
    [3, 'Pregúntale a {pareja} qué parte de su cuerpo le da más pena fotografiar y por qué.'],
    [3, 'Pregúntale a {pareja} si se ha tocado alguna vez mirando una foto tuya.'],
    [4, 'Pregúntale a {pareja} qué foto suya nunca se atrevería a mandarte. Que te la describa.'],
    [4, 'Pregúntale a {pareja} si le daría morbo que grabaran lo que están haciendo ahora.'],
    [4, 'Con el celular en la mano, pregúntale a {pareja} cómo quiere salir en la próxima foto.'],
    [5, 'Pregúntale a {pareja} qué video se atrevería a grabar hoy si supieras que solo lo ven ustedes dos.'],
  ],
  [
    [1, 'Tómale una foto a {pareja} tal como está ahora mismo.'],
    [2, 'Tómale una foto a {pareja} en ropa interior, en la pose que tú le pidas.'],
    [2, 'Que {pareja} te tome una foto en la pose más provocadora que se le ocurra.'],
    [3, 'Tómale a {pareja} tres fotos: una vestida, una en ropa interior y una sin sostén.'],
    [3, 'Tómale una foto solo a la parte del cuerpo de {pareja} que más te gusta.'],
    [3, 'Háganse una foto juntos besándose, con la mano de cada uno donde quieran.'],
    [3, 'Que {pareja} elija una foto suya del celular y te explique qué estaba pensando ese día.'],
    [4, 'Tómale una foto desnuda a {pareja} y déjala que decida si se queda o se borra.'],
    [4, 'Graba diez segundos de video de {pareja} diciéndote al oído lo que quiere que le hagas.', { tags: ['fotos.video'] }],
    [4, 'Tómale una foto a {pareja} mientras la tocas, con su cara fuera del encuadre.'],
    [4, 'Que {pareja} te grabe un video de quince segundos desnudándose.', { tags: ['fotos.video'] }],
    [5, 'Graben un video de un minuto de lo que están haciendo, y véanlo juntos después.', { tags: ['fotos.video'] }],
    [5, 'Tómale fotos a {pareja} mientras se masturba.', { tags: ['masturbacion.mirar'] }],
    [5, 'Pongan el celular grabando y no lo apaguen hasta que termine el turno.', { tags: ['fotos.video'] }],
    [5, 'Graben un video juntos y decidan al final, los dos de acuerdo, si lo guardan o lo borran ahí mismo.', { tags: ['fotos.video'] }],
  ],
);
