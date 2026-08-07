import { facesForLevel } from '../engine/dice';
import type { Level } from '../types';

interface Props {
  nivel: Level;
  onSubir: () => void;
  onBajar: () => void;
}

export function BarraNivel({ nivel, onSubir, onBajar }: Props) {
  const caras = facesForLevel(nivel);

  return (
    <div className="nivel">
      <div className="nivel__fila">
        <button
          type="button"
          className="nivel__boton"
          onClick={onBajar}
          disabled={nivel === 1}
          aria-label="Bajar el nivel"
        >
          −
        </button>

        <div className="nivel__corazones" aria-label={`Nivel ${nivel} de 5`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={n <= nivel ? 'nivel__corazon nivel__corazon--activo' : 'nivel__corazon'}
              aria-hidden="true"
            >
              ♥
            </span>
          ))}
        </div>

        <button
          type="button"
          className="nivel__boton"
          onClick={onSubir}
          disabled={nivel === 5}
          aria-label="Subir el nivel"
        >
          +
        </button>
      </div>

      <div className="nivel__titulo centrado">
        Nivel {nivel} · {caras === 0 ? 'sin dado' : `dado de ${caras} caras`}
      </div>
    </div>
  );
}
