import { useMemo, useState } from 'react';
import { Interruptor } from '../components/Interruptor';
import { CATEGORIES } from '../data/categories';
import { useGame } from '../state/GameContext';

interface Props {
  primeraVez: boolean;
  onListo: () => void;
}

export function LimitesScreen({ primeraVez, onListo }: Props) {
  const { state, dispatch, availableCards } = useGame();
  const [abierta, setAbierta] = useState<string | null>(null);

  const permitidas = useMemo(
    () => CATEGORIES.filter((c) => state.limits[c.id]).length,
    [state.limits],
  );

  const cambiarCategoria = (id: string, valor: boolean) => {
    const categoria = CATEGORIES.find((c) => c.id === id);
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
            {permitidas} de {CATEGORIES.length} categorías permitidas · {availableCards.length} cartas
            activas
          </p>
        </div>
      </div>

      <p className="subtitulo">
        Marquen juntos lo que sí se permite. Lo que quede apagado no va a salir nunca durante el
        juego. Pueden cambiarlo cuando quieran desde Configuración.
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
        {CATEGORIES.map((categoria) => {
          const activa = Boolean(state.limits[categoria.id]);
          const abiertaEsta = abierta === categoria.id;

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
                    {categoria.extras && <span className="contador"> {abiertaEsta ? '▾' : '▸'}</span>}
                  </div>
                  <div className="categoria__hint">{categoria.hint}</div>
                </button>

                <Interruptor
                  activo={activa}
                  etiqueta={categoria.label}
                  onChange={(valor) => cambiarCategoria(categoria.id, valor)}
                />
              </div>

              {abiertaEsta && categoria.extras && (
                <div className="categoria__cuerpo">
                  {categoria.extras.map((extra) => (
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
    </div>
  );
}
