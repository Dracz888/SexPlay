import { useMemo, useState } from 'react';
import { useGame } from '../state/GameContext';
import { defaultPartyPlayers, newPartyPlayer } from '../state/storage';
import type { Gender, Pairing, Player } from '../types';
import { MAX_PARTY_PLAYERS, MIN_PARTY_PLAYERS } from '../types';

interface Props {
  onEmpezar: () => void;
  onVolver: () => void;
}

const REPARTOS: { id: Pairing; titulo: string; texto: string }[] = [
  {
    id: 'hetero',
    titulo: 'Hetero',
    texto: 'A cada quien solo le puede tocar con alguien del sexo opuesto.',
  },
  {
    id: 'mix',
    titulo: 'Mix',
    texto: 'A cada quien le puede tocar con cualquiera de la mesa, sin importar el sexo.',
  },
];

export function SetupFiestaScreen({ onEmpezar, onVolver }: Props) {
  const { state, dispatch } = useGame();
  const [jugadores, setJugadores] = useState<Player[]>(
    () => state.lastPartyPlayers ?? defaultPartyPlayers(),
  );
  const [reparto, setReparto] = useState<Pairing>(state.lastPairing);

  const actualizar = (id: string, cambios: Partial<Player>) => {
    setJugadores((previos) => previos.map((j) => (j.id === id ? { ...j, ...cambios } : j)));
  };

  const agregar = () => {
    setJugadores((previos) => {
      if (previos.length >= MAX_PARTY_PLAYERS) return previos;
      // Entra el sexo que esté en minoría, que es lo que suele hacer falta.
      const hombres = previos.filter((j) => j.gender === 'hombre').length;
      return [...previos, newPartyPlayer(hombres <= previos.length - hombres ? 'hombre' : 'mujer')];
    });
  };

  const quitar = (id: string) => {
    setJugadores((previos) =>
      previos.length <= MIN_PARTY_PLAYERS ? previos : previos.filter((j) => j.id !== id),
    );
  };

  /** En Hetero, quien no tenga a nadie del sexo opuesto se queda sin cartas. */
  const sinPareja = useMemo(() => {
    if (reparto !== 'hetero') return [] as Player[];
    return jugadores.filter((j) => !jugadores.some((otro) => otro.gender !== j.gender));
  }, [jugadores, reparto]);

  const empezar = () => {
    const limpios = jugadores.map((j, i) => ({
      ...j,
      name: j.name.trim() || `Jugador ${i + 1}`,
    }));
    dispatch({ type: 'game/start', mode: 'fiesta', pairing: reparto, players: limpios });
    onEmpezar();
  };

  return (
    <div className="pantalla">
      <div className="encabezado">
        <button type="button" className="boton-volver" onClick={onVolver} aria-label="Volver">
          ←
        </button>
        <div className="crecer">
          <h2>¿Quiénes están en la fiesta?</h2>
          <p className="contador">
            {jugadores.length} de {MAX_PARTY_PLAYERS} personas
          </p>
        </div>
      </div>

      <div className="scroll">
        {jugadores.map((jugador, indice) => (
          <div className="invitado" key={jugador.id}>
            <div className="invitado__fila">
              <input
                value={jugador.name}
                maxLength={18}
                autoComplete="off"
                aria-label={`Nombre de la persona ${indice + 1}`}
                onChange={(e) => actualizar(jugador.id, { name: e.target.value })}
                placeholder={`Jugador ${indice + 1}`}
              />
              <button
                type="button"
                className="icono-boton"
                onClick={() => quitar(jugador.id)}
                disabled={jugadores.length <= MIN_PARTY_PLAYERS}
                aria-label={`Quitar a ${jugador.name || `Jugador ${indice + 1}`}`}
              >
                ✕
              </button>
            </div>

            <div className="opciones">
              {(['hombre', 'mujer'] as Gender[]).map((genero) => (
                <button
                  type="button"
                  key={genero}
                  className="opcion"
                  data-activa={jugador.gender === genero}
                  onClick={() => actualizar(jugador.id, { gender: genero })}
                >
                  {genero === 'hombre' ? 'Hombre' : 'Mujer'}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          className="boton boton--fantasma"
          onClick={agregar}
          disabled={jugadores.length >= MAX_PARTY_PLAYERS}
        >
          {jugadores.length >= MAX_PARTY_PLAYERS
            ? `Máximo ${MAX_PARTY_PLAYERS} personas`
            : 'Agregar a alguien más +'}
        </button>

        <div className="campo">
          <label>¿Con quién te puede tocar?</label>
          <div className="opciones">
            {REPARTOS.map((opcion) => (
              <button
                type="button"
                key={opcion.id}
                className="opcion"
                data-activa={reparto === opcion.id}
                onClick={() => setReparto(opcion.id)}
              >
                {opcion.titulo}
              </button>
            ))}
          </div>
          <p className="contador">{REPARTOS.find((o) => o.id === reparto)!.texto}</p>
        </div>

        {sinPareja.length > 0 && (
          <div className="aviso">
            Con el reparto Hetero no hay nadie del sexo opuesto para{' '}
            {sinPareja.map((j) => j.name.trim() || 'alguien sin nombre').join(', ')}. Cambien a Mix o
            agreguen a más gente, o esas personas se van a quedar sin cartas.
          </div>
        )}

        <p className="subtitulo">
          En cada turno el juego elige a quién le toca. Empiezan siempre en nivel 1 y lo suben
          ustedes cuando quieran. Cualquier carta se puede saltar sin costo.
        </p>
      </div>

      <button type="button" className="boton" onClick={empezar}>
        Empezar la fiesta en nivel 1 ♥
      </button>
    </div>
  );
}
