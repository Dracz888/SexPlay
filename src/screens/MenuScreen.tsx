import { useGame } from '../state/GameContext';

interface Props {
  onJugar: () => void;
  onNuevaPartida: () => void;
  onConfiguracion: () => void;
}

export function MenuScreen({ onJugar, onNuevaPartida, onConfiguracion }: Props) {
  const { state } = useGame();
  const hayPartida = Boolean(state.session);

  return (
    <div className="pantalla pantalla--centro">
      <h1 className="titulo-marca">SexPlay</h1>
      <p className="subtitulo">Un teléfono, cinco niveles. En pareja o en fiesta.</p>

      <div className="corazon-envoltura">
        <button
          type="button"
          className="corazon-jugar"
          onClick={onJugar}
          aria-label={hayPartida ? 'Continuar la partida' : 'Empezar el juego'}
        >
          <svg width="216" height="200" viewBox="0 0 216 200" aria-hidden="true">
            <defs>
              <linearGradient id="grad-corazon" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff6b8a" />
                <stop offset="100%" stopColor="#a30b2a" />
              </linearGradient>
            </defs>
            <path
              d="M108 188c-6 0-11-2-15-6-24-21-56-49-78-76C-3 83 0 44 26 22 48 3 82 8 100 30l8 10 8-10c18-22 52-27 74-8 26 22 29 61 11 84-22 27-54 55-78 76-4 4-9 6-15 6z"
              fill="url(#grad-corazon)"
            />
          </svg>
          <span>{hayPartida ? 'SEGUIR' : 'JUGAR'}</span>
        </button>
      </div>

      {hayPartida && (
        <button type="button" className="boton boton--fantasma" onClick={onNuevaPartida}>
          Empezar una partida nueva
        </button>
      )}

      <button type="button" className="boton boton--suave" onClick={onConfiguracion}>
        Configuración
      </button>
    </div>
  );
}
