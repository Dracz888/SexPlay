import { useMemo, useState } from 'react';
import { Modal } from '../components/Modal';
import { BASE_SHOP_ITEMS } from '../data/shop';
import { useGame } from '../state/GameContext';
import type { PlayerId, ShopItem } from '../types';

export function TiendaScreen({ onVolver }: { onVolver: () => void }) {
  const { state, dispatch } = useGame();
  const sesion = state.session;
  const [comprador, setComprador] = useState<PlayerId>(sesion?.turn ?? 'p1');
  const [canjeando, setCanjeando] = useState<string | null>(null);

  const articulos = useMemo(() => {
    const ocultos = new Set(state.disabledShopItemIds);
    return [...BASE_SHOP_ITEMS, ...state.customShopItems]
      .filter((item) => !ocultos.has(item.id))
      .sort((a, b) => a.cost - b.cost);
  }, [state.customShopItems, state.disabledShopItemIds]);

  const porId = useMemo(
    () => Object.fromEntries(articulos.map((i) => [i.id, i])) as Record<string, ShopItem>,
    [articulos],
  );

  if (!sesion) {
    return (
      <div className="pantalla pantalla--centro">
        <h2>Tienda de Intimidad</h2>
        <p className="texto">
          La Intimidad se gana durante la partida: en nivel 5, cada 6 del dado suma un punto.
        </p>
        <button type="button" className="boton" onClick={onVolver}>
          Volver
        </button>
      </div>
    );
  }

  const jugador = sesion.players.find((j) => j.id === comprador)!;
  const valeCanjeando = sesion.vouchers.find((v) => v.id === canjeando);

  return (
    <div className="pantalla">
      <div className="encabezado">
        <button type="button" className="boton-volver" onClick={onVolver} aria-label="Volver">
          ←
        </button>
        <div className="crecer">
          <h2>Tienda de Intimidad</h2>
          <p className="contador">Cada 6 en nivel 5 vale un punto</p>
        </div>
      </div>

      <div className="opciones">
        {sesion.players.map((j) => (
          <button
            type="button"
            key={j.id}
            className="opcion"
            data-activa={j.id === comprador}
            onClick={() => setComprador(j.id)}
          >
            {j.name} · ♥ {j.intimidad}
          </button>
        ))}
      </div>

      <div className="scroll">
        {sesion.vouchers.filter((v) => v.ownerId === comprador).length > 0 && (
          <>
            <p className="contador">Vales de {jugador.name}</p>
            {sesion.vouchers
              .filter((v) => v.ownerId === comprador)
              .map((vale) => (
                <div className={vale.usedAt ? 'vale vale--usado' : 'vale'} key={vale.id}>
                  <div className="vale__texto">
                    <strong>{porId[vale.itemId]?.title ?? 'Solicitud'}</strong>
                    <div className="articulo__desc">{porId[vale.itemId]?.description}</div>
                  </div>
                  {vale.usedAt ? (
                    <span className="contador">Usado</span>
                  ) : (
                    <button
                      type="button"
                      className="boton boton--chico"
                      onClick={() => setCanjeando(vale.id)}
                    >
                      Canjear
                    </button>
                  )}
                </div>
              ))}
          </>
        )}

        <p className="contador">Solicitudes</p>

        {articulos.map((item) => {
          const alcanza = jugador.intimidad >= item.cost;
          return (
            <div className="articulo" key={item.id}>
              <div className="articulo__cabecera">
                <span className="articulo__titulo">{item.title}</span>
                <span className="articulo__precio">♥ {item.cost}</span>
              </div>
              <p className="articulo__desc">{item.description}</p>
              <button
                type="button"
                className="boton boton--chico"
                disabled={!alcanza}
                onClick={() => dispatch({ type: 'shop/buy', item, playerId: comprador })}
              >
                {alcanza ? `Comprar para ${jugador.name}` : `Faltan ♥ ${item.cost - jugador.intimidad}`}
              </button>
            </div>
          );
        })}
      </div>

      {valeCanjeando && (
        <Modal
          titulo={porId[valeCanjeando.itemId]?.title ?? 'Solicitud'}
          confirmar="Canjeado"
          cancelar="Todavía no"
          onCancelar={() => setCanjeando(null)}
          onConfirmar={() => {
            dispatch({ type: 'shop/redeem', voucherId: valeCanjeando.id });
            setCanjeando(null);
          }}
        >
          <p className="texto">{porId[valeCanjeando.itemId]?.description}</p>
          <p className="subtitulo">
            {sesion.players.find((j) => j.id !== valeCanjeando.ownerId)!.name} tiene que cumplirlo
            ahora.
          </p>
        </Modal>
      )}
    </div>
  );
}
