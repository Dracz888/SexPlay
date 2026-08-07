import { deck } from './_deck';

export const sexo = deck(
  'sexo',
  [
    [2, 'Pregúntale a {pareja} cuál es su postura favorita y por qué justo esa.'],
    [2, 'Pregúntale a {pareja} qué es lo que más le gusta del momento exacto en que la penetras.'],
    [3, 'Pregúntale a {pareja} qué postura nunca han probado y quiere probar hoy.'],
    [3, 'Pregúntale a {pareja} si prefiere despacio y profundo o rápido y fuerte.'],
    [3, 'Con la mano entre sus piernas, pregúntale a {pareja} qué tan mojada está por lo que ha pasado hasta ahora.', { targetGender: 'mujer' }],
    [3, 'Con la mano en su entrepierna, pregúntale a {pareja} qué tan duro lo tiene por lo que ha pasado hasta ahora.', { targetGender: 'hombre' }],
    [4, 'Pregúntale a {pareja} cuál ha sido el mejor polvo de su vida contigo, y qué lo hizo distinto.'],
    [4, 'Pregúntale a {pareja} cómo le gustaría que terminaras hoy, y dónde.'],
    [4, 'Pregúntale a {pareja} cuánto cree que va a durar si empiezas ahora mismo.'],
    [5, 'Pregúntale a {pareja} qué es lo más sucio que quiere que le hagas esta noche. Que lo diga completo.'],
  ],
  [
    [3, 'Restriégate contra {pareja} con la ropa puesta hasta que a los dos les cueste parar.'],
    [3, 'Ponte encima de {pareja} y muévete como si la estuvieras penetrando, pero sin quitarse la ropa interior.'],
    [3, 'Métele solo la punta a {pareja} y quédate quieto treinta segundos.', { actorGender: 'hombre' }],
    [3, 'Que {pareja} te ponga solo la punta y se quede quieto treinta segundos.', { targetGender: 'hombre' }],
    [4, 'Penetra a {pareja} en la postura que ella elija durante un minuto.'],
    [4, 'Cójanse de pie, contra la pared.'],
    [4, 'Que {pareja} se ponga encima y lleve ella el ritmo durante un minuto.'],
    [4, 'Cójanse de cucharita, muy despacio, mientras la acaricias por delante.'],
    [4, 'Penetra a {pareja} desde atrás agarrándole el pelo.'],
    [4, 'Cambien de postura cada treinta segundos durante dos minutos.'],
    [5, 'Penétrala mirándola a los ojos, sin apartar la mirada ni un segundo.'],
    [5, 'Llévala al borde y para. Repítelo hasta que te ruegue que la dejes acabar.', { tags: ['sexo.control_orgasmo'] }],
    [5, 'Cójanse hasta que {pareja} acabe. Después ella decide qué haces tú.'],
    [5, 'Acaba sobre el cuerpo de {pareja}, donde ella te diga.', { tags: ['sexo.acabar_cuerpo'] }],
    [5, 'Que {pareja} elija postura, ritmo y final. Tú solo obedeces.', { tags: ['dominacion'] }],
  ],
);
