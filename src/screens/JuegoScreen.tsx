import { useEffect, useRef, useState } from 'react';
import { BarraNivel } from '../components/BarraNivel';
import { Modal } from '../components/Modal';
import { categoryLabel } from '../data/categories';
import { drawCard } from '../engine/deck';
import { facesForLevel, INTIMACY_PER_SIX, rollForLevel } from '../engine/dice';
import { fillCardText } from '../engine/text';
import { useGame } from '../state/GameContext';
import type { Level } from '../types';

interface Props {
  onSalir: () => void;
  onTienda: () => void;
  onLimites: () => void;
}

export function JuegoScreen({ onSalir, onTienda, onLimites }: Props) {
  const { state, dispatch, availableCards } = useGame();
  const sesion = state.session;

  const [girando, setGirando] = useState(false);
  const [confirmarNivel, setConfirmarNivel] = useState<Level | null>(null);
  const [pausa, setPausa] = useState(false);
  const temporizador = useRef<number | null>(null);

  useEffect(() => () => {
    if (temporizador.current) window.clearTimeout(temporizador.current);
  }, []);

  if (!sesion) {
    return (
      <div className="pantalla pantalla--centro">
        <p className="texto">No hay ninguna partida abierta.</p>
        <button type="button" className="boton" onClick={onSalir}>
          Volver al menú
        </button>
      </div>
    );
  }

  const enTurno = sesion.players.find((j) => j.id === sesion.turn)!;
  const pareja = sesion.players.find((j) => j.id !== sesion.turn)!;
  const caras = facesForLevel(sesion.level);
  const valesSinUsar = sesion.vouchers.filter((v) => !v.usedAt).length;

  const lanzar = () => {
    if (girando) return;
    setGirando(true);

    temporizador.current = window.setTimeout(() => {
      const tirada = rollForLevel(sesion.level);
      const sacada =
        tirada.cardLevel === null
          ? null
          : drawCard(availableCards, tirada.cardLevel, enTurno, pareja, sesion.usedByBag);

      dispatch({ type: 'game/rolled', roll: tirada, draw: sacada });
      setGirando(false);
    }, caras === 0 ? 220 : 620);
  };

  const cambiarNivel = (nuevo: Level) => {
    if (nuevo > sesion.level) {
      setConfirmarNivel(nuevo);
    } else {
      dispatch({ type: 'game/setLevel', level: nuevo });
    }
  };

  return (
    <div className="pantalla">
      <div className="encabezado">
        <button type="button" className="boton-volver" onClick={() => setPausa(true)} aria-label="Pausa">
          ☰
        </button>
        <div className="crecer centrado">
          <span className="contador">Turno {sesion.turnCount + 1}</span>
        </div>
        <button type="button" className="boton-volver" onClick={onTienda} aria-label="Tienda">
          ♦
        </button>
      </div>

      <BarraNivel
        nivel={sesion.level}
        onSubir={() => cambiarNivel(Math.min(5, sesion.level + 1) as Level)}
        onBajar={() => cambiarNivel(Math.max(1, sesion.level - 1) as Level)}
      />

      <div className="jugadores">
        {sesion.players.map((jugador) => (
          <div
            key={jugador.id}
            className={jugador.id === sesion.turn ? 'jugador jugador--turno' : 'jugador'}
          >
            <div className="jugador__nombre">{jugador.name}</div>
            <div className="jugador__intimidad">♥ {jugador.intimidad} de Intimidad</div>
          </div>
        ))}
      </div>

      <div className="scroll" style={{ justifyContent: 'center', alignItems: 'center', gap: 18 }}>
        {sesion.phase === 'listo' && (
          <>
            <p className="texto centrado">
              Es el turno de <strong>{enTurno.name}</strong>.
            </p>

            <div className={girando ? 'dado dado--girando' : 'dado'} aria-live="polite">
              {girando ? '♥' : caras === 0 ? '♥' : (sesion.roll ?? '?')}
            </div>

            <p className="dado-info">
              {caras === 0
                ? 'En nivel 1 no hay dado: siempre sale una carta de nivel 1.'
                : `Dado de ${caras} caras. Lo que salga es el nivel de la carta${
                    sesion.level === 5 ? '. Si sacas 6, ganas Intimidad.' : '.'
                  }`}
            </p>

            <button type="button" className="boton boton--ancho" onClick={lanzar} disabled={girando}>
              {caras === 0 ? 'Sacar carta' : 'Lanzar el dado'}
            </button>
          </>
        )}

        {sesion.phase === 'intimidad' && (
          <>
            <div className="dado">6</div>
            <div className="carta centrado">
              <div className="carta__tipo">Intimidad</div>
              <p className="carta__texto">
                ¡{enTurno.name} sacó un 6! Gana {INTIMACY_PER_SIX} de Intimidad para canjear en la
                tienda.
              </p>
              <button type="button" className="boton boton--suave boton--chico" onClick={onTienda}>
                Ir a la tienda
              </button>
            </div>
            <button
              type="button"
              className="boton boton--ancho"
              onClick={() => dispatch({ type: 'game/endTurn' })}
            >
              Pasar el turno a {pareja.name}
            </button>
          </>
        )}

        {sesion.phase === 'carta' && sesion.card && (
          <>
            {caras > 0 && <div className="dado">{sesion.roll}</div>}

            <div className="carta" style={{ width: '100%' }}>
              <div className="carta__cabecera">
                <span className="carta__tipo">
                  {sesion.card.type === 'pregunta' ? 'Pregunta' : 'Reto'}
                </span>
                <span className="carta__nivel">Nivel {sesion.card.level}</span>
              </div>

              <p className="carta__texto">{fillCardText(sesion.card.text, enTurno, pareja)}</p>

              <span className="carta__categoria">{categoryLabel(sesion.card.category)}</span>
            </div>

            {sesion.notice && <div className="aviso">{sesion.notice}</div>}

            <div className="botonera botonera--fila" style={{ width: '100%' }}>
              <button
                type="button"
                className="boton"
                onClick={() => dispatch({ type: 'game/endTurn' })}
              >
                Cumplido ♥
              </button>
              <button
                type="button"
                className="boton boton--fantasma"
                onClick={() => dispatch({ type: 'game/endTurn' })}
              >
                Paso
              </button>
            </div>
            <p className="dado-info">Pasar no cuesta nada. Nadie tiene que hacer lo que no quiera.</p>
          </>
        )}

        {sesion.phase === 'listo' && sesion.notice && <div className="aviso">{sesion.notice}</div>}
      </div>

      {confirmarNivel !== null && (
        <Modal
          titulo={`¿Suben a nivel ${confirmarNivel}?`}
          confirmar="Sí, subimos"
          cancelar="Mejor no"
          onCancelar={() => setConfirmarNivel(null)}
          onConfirmar={() => {
            dispatch({ type: 'game/setLevel', level: confirmarNivel });
            setConfirmarNivel(null);
          }}
        >
          <p className="subtitulo">
            A partir de ahora lanzan un dado de {facesForLevel(confirmarNivel)} caras y pueden salir
            cartas más intensas.
            {confirmarNivel === 5 && ' Con un 6 se gana Intimidad para la tienda.'}
          </p>
        </Modal>
      )}

      {pausa && (
        <Modal
          titulo="Pausa"
          confirmar="Seguir jugando"
          onConfirmar={() => setPausa(false)}
          cancelar="Terminar la partida"
          onCancelar={() => {
            dispatch({ type: 'game/finish' });
            setPausa(false);
            onSalir();
          }}
        >
          <p className="subtitulo">
            {valesSinUsar > 0
              ? `Tienen ${valesSinUsar} ${valesSinUsar === 1 ? 'vale sin usar' : 'vales sin usar'} en la tienda.`
              : 'Todavía no han comprado nada en la tienda.'}
          </p>
          <div className="botonera">
            <button
              type="button"
              className="boton boton--suave"
              onClick={() => {
                setPausa(false);
                onTienda();
              }}
            >
              Tienda de Intimidad
            </button>
            <button
              type="button"
              className="boton boton--suave"
              onClick={() => {
                setPausa(false);
                onLimites();
              }}
            >
              Ver o cambiar los límites
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
