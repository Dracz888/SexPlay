import { useState } from 'react';
import { Modal } from '../components/Modal';
import { CATEGORIES } from '../data/categories';
import { useGame } from '../state/GameContext';

interface Props {
  onVolver: () => void;
  onLimites: () => void;
  onCartas: () => void;
  onSolicitudes: () => void;
}

export function ConfiguracionScreen({ onVolver, onLimites, onCartas, onSolicitudes }: Props) {
  const { state, dispatch, availableCards } = useGame();
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);

  const permitidas = CATEGORIES.filter((c) => state.limits[c.id]).length;

  return (
    <div className="pantalla">
      <div className="encabezado">
        <button type="button" className="boton-volver" onClick={onVolver} aria-label="Volver">
          ←
        </button>
        <h2>Configuración</h2>
      </div>

      <div className="scroll">
        <button type="button" className="articulo" onClick={onLimites} style={{ textAlign: 'left' }}>
          <div className="articulo__cabecera">
            <span className="articulo__titulo">Lista de límites</span>
            <span className="articulo__precio">
              {permitidas}/{CATEGORIES.length}
            </span>
          </div>
          <p className="articulo__desc">
            Qué se permite y qué no. Lo que esté apagado no sale nunca en el juego.
          </p>
        </button>

        <button type="button" className="articulo" onClick={onCartas} style={{ textAlign: 'left' }}>
          <div className="articulo__cabecera">
            <span className="articulo__titulo">Preguntas y retos</span>
            <span className="articulo__precio">{availableCards.length}</span>
          </div>
          <p className="articulo__desc">
            Ver todas las cartas, eliminar las que no les gusten y crear las suyas propias.
          </p>
        </button>

        <button
          type="button"
          className="articulo"
          onClick={onSolicitudes}
          style={{ textAlign: 'left' }}
        >
          <div className="articulo__cabecera">
            <span className="articulo__titulo">Solicitudes de la tienda</span>
            <span className="articulo__precio">{state.customShopItems.length}</span>
          </div>
          <p className="articulo__desc">
            Cambiar lo que se puede canjear con la Intimidad y añadir solicitudes suyas.
          </p>
        </button>

        <div className="panel pila">
          <div>
            <strong>Cómo funciona el juego</strong>
            <p className="articulo__desc" style={{ marginTop: 6 }}>
              Cada uno tiene su turno. En nivel 1 sale directo una carta de nivel 1. Del nivel 2 al 4
              se lanza un dado con tantas caras como el nivel, y lo que salga es el nivel de la carta.
              En nivel 5 el dado es de 6 caras: del 1 al 5 sale carta y con el 6 se gana Intimidad
              para la tienda.
            </p>
          </div>
          <p className="articulo__desc">
            Acuerden una palabra de seguridad antes de subir de nivel. Cualquier carta se puede
            saltar sin costo.
          </p>
        </div>

        <button
          type="button"
          className="boton boton--fantasma"
          onClick={() => setConfirmarBorrado(true)}
        >
          Borrar todos los datos
        </button>

        <p className="subtitulo centrado">
          Todo se guarda solo en este teléfono. No hay cuentas ni se sube nada a internet.
        </p>
      </div>

      {confirmarBorrado && (
        <Modal
          titulo="¿Borrar todo?"
          confirmar="Sí, borrar todo"
          cancelar="Cancelar"
          onCancelar={() => setConfirmarBorrado(false)}
          onConfirmar={() => {
            dispatch({ type: 'data/reset' });
            setConfirmarBorrado(false);
            onVolver();
          }}
        >
          <p className="texto">
            Se borran los límites, las cartas que crearon, las solicitudes propias y la partida en
            curso. La app vuelve a empezar desde cero.
          </p>
        </Modal>
      )}
    </div>
  );
}
