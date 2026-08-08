import { MAX_PARTY_PLAYERS, MIN_PARTY_PLAYERS, type GameMode } from '../types';

interface Props {
  onElegir: (modo: GameMode) => void;
  onVolver: () => void;
}

const MODOS: { id: GameMode; titulo: string; gente: string; texto: string }[] = [
  {
    id: 'pareja',
    titulo: 'Pareja',
    gente: '2 personas',
    texto:
      'El juego de siempre: un teléfono, los dos, cinco niveles. Cada carta es para ustedes dos y nadie más.',
  },
  {
    id: 'fiesta',
    titulo: 'Fiesta',
    gente: `de ${MIN_PARTY_PLAYERS} a ${MAX_PARTY_PLAYERS} personas`,
    texto:
      'Se agrega toda la gente que quieran. El juego reparte a quién le toca en cada carta y entran los retos de grupo: besos de tres, parejas cruzadas y retos para el que quede en el medio.',
  },
];

export function ModoScreen({ onElegir, onVolver }: Props) {
  return (
    <div className="pantalla">
      <div className="encabezado">
        <button type="button" className="boton-volver" onClick={onVolver} aria-label="Volver">
          ←
        </button>
        <h2>¿Cómo van a jugar?</h2>
      </div>

      <div className="scroll">
        {MODOS.map((modo) => (
          <button
            key={modo.id}
            type="button"
            className="modo"
            onClick={() => onElegir(modo.id)}
          >
            <div className="modo__cabecera">
              <span className="modo__titulo">{modo.titulo}</span>
              <span className="modo__gente">{modo.gente}</span>
            </div>
            <p className="modo__texto">{modo.texto}</p>
          </button>
        ))}

        <p className="subtitulo centrado">
          Los límites que marcaron en Configuración valen para los dos modos. En Fiesta se suman
          además las cartas de la categoría Fiesta.
        </p>
      </div>
    </div>
  );
}
