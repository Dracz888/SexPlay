import { useRef, useState } from 'react';
import { Modal } from '../components/Modal';
import { CATEGORIES } from '../data/categories';
import { useGame } from '../state/GameContext';
import { backupFileName, parseBackup } from '../state/storage';
import type { PersistedState } from '../types';

interface Props {
  onVolver: () => void;
  onLimites: () => void;
  onCartas: () => void;
  onSolicitudes: () => void;
  /** Al borrar todo hay que volver al principio: ya no hay límites marcados. */
  onBorrarTodo: () => void;
}

export function ConfiguracionScreen({
  onVolver,
  onLimites,
  onCartas,
  onSolicitudes,
  onBorrarTodo,
}: Props) {
  const { state, dispatch, availableCards } = useGame();
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);
  const [porImportar, setPorImportar] = useState<PersistedState | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const archivoRef = useRef<HTMLInputElement>(null);

  const permitidas = CATEGORIES.filter((c) => state.limits[c.id]).length;

  const exportar = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = backupFileName();
    enlace.click();
    URL.revokeObjectURL(url);
    setMensaje('Copia guardada en tus descargas. Guárdala donde no se te pierda.');
  };

  const elegirArchivo = async (evento: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = evento.target.files?.[0];
    // Se limpia para poder volver a elegir el mismo archivo después.
    evento.target.value = '';
    if (!archivo) return;

    const datos = parseBackup(await archivo.text());
    if (datos) {
      setPorImportar(datos);
    } else {
      setMensaje('Ese archivo no es una copia de SexPlay. No se cambió nada.');
    }
  };

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

        <div className="panel pila">
          <div>
            <strong>Copia de seguridad</strong>
            <p className="articulo__desc" style={{ marginTop: 6 }}>
              Guarda en un archivo tus límites, tus cartas y tus solicitudes. Sirve para no perderlos
              si cambias de teléfono o si el navegador borra los datos, y para pasarle tu
              configuración a otro celular.
            </p>
          </div>

          <div className="botonera botonera--fila">
            <button type="button" className="boton boton--suave boton--chico" onClick={exportar}>
              Exportar
            </button>
            <button
              type="button"
              className="boton boton--suave boton--chico"
              onClick={() => archivoRef.current?.click()}
            >
              Importar
            </button>
          </div>

          <input
            ref={archivoRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={elegirArchivo}
          />

          {mensaje && <div className="aviso">{mensaje}</div>}
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

      {porImportar && (
        <Modal
          titulo="¿Importar esta copia?"
          confirmar="Sí, importar"
          cancelar="Cancelar"
          onCancelar={() => setPorImportar(null)}
          onConfirmar={() => {
            dispatch({ type: 'data/import', state: porImportar });
            setPorImportar(null);
            setMensaje('Listo, se importaron los datos de la copia.');
          }}
        >
          <p className="texto">
            Reemplaza lo que tienes ahora en este teléfono: los límites, las cartas que hayas creado,
            las solicitudes y la partida en curso.
          </p>
          <p className="subtitulo">
            La copia trae {CATEGORIES.filter((c) => porImportar.limits[c.id]).length} categorías
            permitidas, {porImportar.customCards.length}{' '}
            {porImportar.customCards.length === 1 ? 'carta propia' : 'cartas propias'} y{' '}
            {porImportar.customShopItems.length}{' '}
            {porImportar.customShopItems.length === 1 ? 'solicitud propia' : 'solicitudes propias'}.
          </p>
        </Modal>
      )}

      {confirmarBorrado && (
        <Modal
          titulo="¿Borrar todo?"
          confirmar="Sí, borrar todo"
          cancelar="Cancelar"
          onCancelar={() => setConfirmarBorrado(false)}
          onConfirmar={() => {
            dispatch({ type: 'data/reset' });
            setConfirmarBorrado(false);
            onBorrarTodo();
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
