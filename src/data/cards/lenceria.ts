import { deck } from './_deck';

export const lenceria = deck(
  'lenceria',
  [
    [1, 'Pregúntale a {pareja} qué ropa interior tuya le gusta más y por qué.'],
    [1, 'Pregúntale a {pareja} qué prenda tuya le dan más ganas de arrancarte.'],
    [2, 'Métele un dedo por debajo del elástico de la ropa interior a {pareja} y pregúntale qué lleva puesto debajo de todo.'],
    [2, 'Pregúntale a {pareja} si se puso esa ropa interior pensando en que la vieras hoy.'],
    [3, 'Pregúntale a {pareja} qué lencería le gustaría verte puesta. Que sea específica.'],
    [3, 'Pregúntale a {pareja} si alguna vez ha salido a la calle sin ropa interior, y cómo se sintió.'],
    [3, 'Pregúntale a {pareja} qué prefiere: verte con lencería o verte sin nada.'],
    [4, 'Pregúntale a {pareja} si se atrevería a salir mañana con la ropa interior que tú le elijas.'],
    [4, 'Pregúntale a {pareja} qué se pondría para ti si supiera que nadie más la va a ver nunca.'],
    [4, 'Con su ropa interior en la mano, pregúntale a {pareja} qué quiere que haga con ella.'],
  ],
  [
    [1, 'Quítale a {pareja} una prenda y guárdatela tú.'],
    [2, 'Que {pareja} se quede solo en ropa interior el resto de la partida.'],
    [2, 'Elige tú la ropa interior que {pareja} se va a poner ahora mismo.'],
    [2, 'Quítale la ropa interior a {pareja} sin quitarle nada más.'],
    [3, 'Que {pareja} se ponga tu ropa interior encima de la suya.', { tags: ['lenceria.cruzada'] }],
    [3, 'Métele la mano por dentro de la ropa interior a {pareja} y déjala ahí quieta un minuto.'],
    [3, 'Que {pareja} se ponga la lencería que tú elijas y desfile delante de ti.'],
    [3, 'Quítale el sostén a {pareja} con una sola mano, sin quitarle la camisa.', { targetGender: 'mujer' }],
    [3, 'Quítale la camisa a {pareja} con los dientes donde se pueda.', { targetGender: 'hombre' }],
    [4, 'Que {pareja} se quede solo con la ropa interior puesta y tú se la vas rompiendo o corriendo con las manos.'],
    [4, 'Ponte la ropa de {pareja} y déjala que te la quite.', { tags: ['lenceria.cruzada'] }],
    [4, 'Que {pareja} pase el resto de la partida sin ropa interior debajo.'],
    [4, 'Quítale toda la ropa a {pareja} usando solo una mano.'],
    [5, 'Que {pareja} se ponga la lencería que le elijas y no se la puede quitar en toda la noche, pase lo que pase.'],
    [5, 'Desnuda a {pareja} del todo y quédate tú vestida. Tócala así durante dos minutos.'],
  ],
);
