import { useMemo, useState } from 'react';
import { EditorCategoria } from '../components/EditorCategoria';
import { Interruptor } from '../components/Interruptor';
import { Modal } from '../components/Modal';
import { useGame } from '../state/GameContext';
import type { Category } from '../types';

interface Props {
  primeraVez: boolean;
  onListo: () => void;
}

export function LimitesScreen({ primeraVez, onListo }: Props) {
  const { state, dispatch, availableCards, categories } = useGame();
  const [abierta, setAbierta] = useState<string | null>(null);
  const [renombrando, setRenombrando] = useState<Category | null>(null);
  const [porBorrar, setPorBorrar] = useState<Category | null>(null);

  const permitidas = useMemo(
    () => categories.filter((c) => state.limits[c.id]).length,
    [categories, state.limits],
  );

  /** Cuántas cartas propias se irían con la categoría que está a punto de borrarse. */
  const cartasDeLaBorrada = porBorrar
    ? state.customCards.filter((c) => c.category === porBorrar.id).length
    : 0;

  const cambiarCategoria = (id: string, valor: boolean) => {
    const categoria = categories.find((c) => c.id === id);
    const ids = [id, ...(valor ? [] : (categoria?.extras ?? []).map((e) => e.id))];
    dispatch({ type: 'limits/set', ids, value: valor });
  };

  return (
    <div className="pantalla">
      <div className="encabezado">
        {!primeraVez && (
          <button type="button" className="boton-volver" onClick={onListo} aria-label="Volver">
            ←
          </button>
        )}
        <div className="crecer">
          <h2>Hasta dónde llegamos</h2>
          <p className="contador">
            {permitidas} de {categories.length} categorías permitidas · {availableCards.length} cartas
            activas
          </p>
        </div>
      </div>

      <p className="subtitulo">
        Marquen juntos lo que sí se permite. Lo que quede apagado no va a salir nunca durante el
        juego. Pueden cambiarlo cuando quieran desde Configuración. Las categorías marcadas como
        <strong> Solo en Fiesta</strong> únicamente salen en las partidas de tres personas o más.
      </p>

      <div className="botonera botonera--fila">
        <button
          type="button"
          className="boton boton--suave boton--chico"
          onClick={() => dispatch({ type: 'limits/allowAll' })}
        >
          Permitir todo
        </button>
        <button
          type="button"
          className="boton boton--fantasma boton--chico"
          onClick={() => dispatch({ type: 'limits/clearAll' })}
        >
          Quitar todo
        </button>
      </div>

      <div className="scroll">
        {categories.map((categoria) => {
          const activa = Boolean(state.limits[categoria.id]);
          const abiertaEsta = abierta === categoria.id;
          // Las propias también se despliegan, para poder cambiarles el nombre o borrarlas.
          const desplegable = Boolean(categoria.extras?.length) || Boolean(categoria.custom);

          return (
            <div className="categoria" key={categoria.id}>
              <div className="categoria__cabecera">
                <button
                  type="button"
                  className="categoria__texto"
                  onClick={() => setAbierta(abiertaEsta ? null : categoria.id)}
                  aria-expanded={abiertaEsta}
                >
                  <div className="categoria__label">
                    {categoria.label}
                    {categoria.partyOnly && (
                      <span className="etiqueta etiqueta--fiesta">Solo en Fiesta</span>
                    )}
                    {categoria.custom && (
                      <span className="etiqueta etiqueta--propia etiqueta--enlinea">Propia</span>
                    )}
                    {desplegable && <span className="contador"> {abiertaEsta ? '▾' : '▸'}</span>}
                  </div>
                  <div className="categoria__hint">{categoria.hint}</div>
                </button>

                <Interruptor
                  activo={activa}
                  etiqueta={categoria.label}
                  onChange={(valor) => cambiarCategoria(categoria.id, valor)}
                />
              </div>

              {abiertaEsta && desplegable && (
                <div className="categoria__cuerpo">
                  {(categoria.extras ?? []).map((extra) => (
                    <div className="extra" key={extra.id}>
                      <span className="crecer">{extra.label}</span>
                      <Interruptor
                        chico
                        activo={Boolean(state.limits[extra.id])}
                        etiqueta={extra.label}
                        onChange={(valor) =>
                          dispatch({
                            type: 'limits/set',
                            ids: valor ? [extra.id, categoria.id] : [extra.id],
                            value: valor,
                          })
                        }
                      />
                    </div>
                  ))}

                  {categoria.custom && (
                    <div className="botonera botonera--fila">
                      <button
                        type="button"
                        className="boton boton--suave boton--chico"
                        onClick={() => setRenombrando(categoria)}
                      >
                        Cambiar nombre
                      </button>
                      <button
                        type="button"
                        className="boton boton--fantasma boton--chico"
                        onClick={() => setPorBorrar(categoria)}
                      >
                        Borrar categoría
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="boton"
        onClick={() => {
          if (primeraVez) dispatch({ type: 'onboarding/done' });
          onListo();
        }}
      >
        {primeraVez ? 'Listo, al juego ♥' : 'Guardar y volver'}
      </button>

      {renombrando && (
        <EditorCategoria
          categoria={renombrando}
          onGuardada={() => setRenombrando(null)}
          onCancelar={() => setRenombrando(null)}
        />
      )}

      {porBorrar && (
        <Modal
          titulo={`¿Borrar "${porBorrar.label}"?`}
          confirmar="Sí, borrarla"
          cancelar="Cancelar"
          onCancelar={() => setPorBorrar(null)}
          onConfirmar={() => {
            dispatch({ type: 'categories/deleteCustom', categoryId: porBorrar.id });
            if (abierta === porBorrar.id) setAbierta(null);
            setPorBorrar(null);
          }}
        >
          <p className="texto">
            {cartasDeLaBorrada === 0
              ? 'La categoría no tiene ninguna carta, así que no se pierde nada más.'
              : cartasDeLaBorrada === 1
                ? 'Se borra también la carta que tienen dentro.'
                : `Se borran también las ${cartasDeLaBorrada} cartas que tienen dentro.`}
          </p>
        </Modal>
      )}
    </div>
  );
}
