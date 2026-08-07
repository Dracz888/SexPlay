import { useState } from 'react';
import { BASE_SHOP_ITEMS } from '../data/shop';
import { useGame } from '../state/GameContext';
import type { ShopItem } from '../types';

export function SolicitudesScreen({ onVolver }: { onVolver: () => void }) {
  const { state, dispatch } = useGame();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState(3);

  const ocultos = new Set(state.disabledShopItemIds);

  const crear = () => {
    const nombre = titulo.trim();
    if (!nombre) return;

    const item: ShopItem = {
      id: `propia-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: nombre,
      description: descripcion.trim() || 'Tu pareja tiene que cumplirlo.',
      cost: Math.max(1, Math.min(20, precio)),
      custom: true,
    };

    dispatch({ type: 'shopItems/save', item });
    setTitulo('');
    setDescripcion('');
    setPrecio(3);
  };

  return (
    <div className="pantalla">
      <div className="encabezado">
        <button type="button" className="boton-volver" onClick={onVolver} aria-label="Volver">
          ←
        </button>
        <div className="crecer">
          <h2>Solicitudes de la tienda</h2>
          <p className="contador">Lo que se puede canjear con la Intimidad</p>
        </div>
      </div>

      <div className="scroll">
        <div className="panel pila">
          <strong>Añadir una solicitud suya</strong>
          <div className="campo">
            <label htmlFor="titulo-solicitud">Título</label>
            <input
              id="titulo-solicitud"
              value={titulo}
              maxLength={40}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Desayuno en la cama"
            />
          </div>
          <div className="campo">
            <label htmlFor="desc-solicitud">Qué tiene que cumplir</label>
            <input
              id="desc-solicitud"
              value={descripcion}
              maxLength={160}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descríbelo con detalle"
            />
          </div>
          <div className="campo">
            <label htmlFor="precio-solicitud">Precio en Intimidad</label>
            <input
              id="precio-solicitud"
              type="number"
              min={1}
              max={20}
              value={precio}
              onChange={(e) => setPrecio(Number(e.target.value))}
            />
          </div>
          <button type="button" className="boton boton--chico" onClick={crear} disabled={!titulo.trim()}>
            Añadir a la tienda
          </button>
        </div>

        {[...BASE_SHOP_ITEMS, ...state.customShopItems].map((item) => {
          const oculto = ocultos.has(item.id);
          return (
            <div className={oculto ? 'item-carta item-carta--oculta' : 'item-carta'} key={item.id}>
              <div className="item-carta__cuerpo">
                <div className="item-carta__meta">
                  <span className="etiqueta">♥ {item.cost}</span>
                  {item.custom && <span className="etiqueta etiqueta--propia">Propia</span>}
                  {oculto && <span className="etiqueta">Oculta</span>}
                </div>
                <strong>{item.title}</strong>
                <p className="item-carta__texto">{item.description}</p>
              </div>
              <div className="item-carta__acciones">
                <button
                  type="button"
                  className="icono-boton"
                  aria-label={item.custom ? 'Borrar la solicitud' : oculto ? 'Recuperarla' : 'Ocultarla'}
                  onClick={() =>
                    dispatch(
                      item.custom
                        ? { type: 'shopItems/deleteCustom', itemId: item.id }
                        : { type: 'shopItems/toggleDisabled', itemId: item.id },
                    )
                  }
                >
                  {item.custom ? '✕' : oculto ? '↺' : '✕'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
