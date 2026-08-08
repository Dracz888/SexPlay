import { useMemo, useState } from 'react';
import { CATEGORIES, categoryLabel } from '../data/categories';
import { allCards } from '../engine/deck';
import { previewCardText } from '../engine/text';
import { useGame } from '../state/GameContext';
import type { PlayCard } from '../types';

interface Props {
  onVolver: () => void;
  onNueva: () => void;
  onEditar: (carta: PlayCard) => void;
}

const POR_PAGINA = 40;

export function GestorCartasScreen({ onVolver, onNueva, onEditar }: Props) {
  const { state, dispatch } = useGame();
  const [categoria, setCategoria] = useState('todas');
  const [nivel, setNivel] = useState('todos');
  const [tipo, setTipo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [visibles, setVisibles] = useState(POR_PAGINA);

  const ocultas = useMemo(() => new Set(state.disabledCardIds), [state.disabledCardIds]);

  const filtradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return allCards(state.customCards).filter((carta) => {
      if (categoria !== 'todas' && carta.category !== categoria) return false;
      if (nivel !== 'todos' && String(carta.level) !== nivel) return false;
      if (tipo !== 'todos' && carta.type !== tipo) return false;
      if (texto && !carta.text.toLowerCase().includes(texto)) return false;
      return true;
    });
  }, [state.customCards, categoria, nivel, tipo, busqueda]);

  const activas = filtradas.filter((c) => !ocultas.has(c.id)).length;

  const cambiarFiltro = (aplicar: () => void) => {
    aplicar();
    setVisibles(POR_PAGINA);
  };

  return (
    <div className="pantalla">
      <div className="encabezado">
        <button type="button" className="boton-volver" onClick={onVolver} aria-label="Volver">
          ←
        </button>
        <div className="crecer">
          <h2>Preguntas y retos</h2>
          <p className="contador">
            {activas} activas de {filtradas.length} que coinciden
          </p>
        </div>
      </div>

      <div className="filtros">
        <select
          value={categoria}
          onChange={(e) => cambiarFiltro(() => setCategoria(e.target.value))}
          aria-label="Categoría"
        >
          <option value="todas">Todas las categorías</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        <select value={tipo} onChange={(e) => cambiarFiltro(() => setTipo(e.target.value))} aria-label="Tipo">
          <option value="todos">Preguntas y retos</option>
          <option value="pregunta">Solo preguntas</option>
          <option value="reto">Solo retos</option>
        </select>

        <select value={nivel} onChange={(e) => cambiarFiltro(() => setNivel(e.target.value))} aria-label="Nivel">
          <option value="todos">Todos los niveles</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={String(n)}>
              Nivel {n}
            </option>
          ))}
        </select>

        <input
          value={busqueda}
          onChange={(e) => cambiarFiltro(() => setBusqueda(e.target.value))}
          placeholder="Buscar en el texto"
          aria-label="Buscar"
        />
      </div>

      <button type="button" className="boton" onClick={onNueva}>
        Crear una carta nueva ♥
      </button>

      <div className="scroll">
        {filtradas.slice(0, visibles).map((carta) => {
          const oculta = ocultas.has(carta.id);
          return (
            <div className={oculta ? 'item-carta item-carta--oculta' : 'item-carta'} key={carta.id}>
              <div className="item-carta__cuerpo">
                <div className="item-carta__meta">
                  <span className={carta.type === 'reto' ? 'etiqueta etiqueta--reto' : 'etiqueta'}>
                    {carta.type === 'reto' ? 'Reto' : 'Pregunta'}
                  </span>
                  <span className="etiqueta">Nivel {carta.level}</span>
                  <span className="etiqueta">{categoryLabel(carta.category)}</span>
                  {carta.custom && <span className="etiqueta etiqueta--propia">Propia</span>}
                  {oculta && <span className="etiqueta">Eliminada</span>}
                </div>
                <p className="item-carta__texto">{previewCardText(carta.text)}</p>
              </div>

              <div className="item-carta__acciones">
                {carta.custom ? (
                  <>
                    <button
                      type="button"
                      className="icono-boton"
                      onClick={() => onEditar(carta)}
                      aria-label="Editar la carta"
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      className="icono-boton"
                      onClick={() => dispatch({ type: 'cards/deleteCustom', cardId: carta.id })}
                      aria-label="Borrar la carta"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="icono-boton"
                    onClick={() => dispatch({ type: 'cards/toggleDisabled', cardId: carta.id })}
                    aria-label={oculta ? 'Recuperar la carta' : 'Eliminar la carta'}
                  >
                    {oculta ? '↺' : '✕'}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {visibles < filtradas.length && (
          <button
            type="button"
            className="boton boton--fantasma"
            onClick={() => setVisibles((v) => v + POR_PAGINA)}
          >
            Ver más ({filtradas.length - visibles} restantes)
          </button>
        )}

        {filtradas.length === 0 && <p className="subtitulo centrado">No hay cartas con esos filtros.</p>}
      </div>
    </div>
  );
}
