import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { DEFAULT_PLAYERS } from '../state/storage';
import type { Gender, Player } from '../types';

interface Props {
  onEmpezar: () => void;
  onVolver: () => void;
}

export function SetupScreen({ onEmpezar, onVolver }: Props) {
  const { state, dispatch } = useGame();
  const guardados = state.lastPlayers ?? DEFAULT_PLAYERS;
  const [jugadores, setJugadores] = useState<[Player, Player]>([
    { ...guardados[0], intimidad: 0 },
    { ...guardados[1], intimidad: 0 },
  ]);

  const actualizar = (indice: 0 | 1, cambios: Partial<Player>) => {
    setJugadores((previos) => {
      const copia: [Player, Player] = [{ ...previos[0] }, { ...previos[1] }];
      copia[indice] = { ...copia[indice], ...cambios };
      return copia;
    });
  };

  const empezar = () => {
    const limpios = jugadores.map((j, i) => ({
      ...j,
      name: j.name.trim() || (i === 0 ? 'Jugador 1' : 'Jugador 2'),
    })) as [Player, Player];
    dispatch({ type: 'game/start', players: limpios });
    onEmpezar();
  };

  return (
    <div className="pantalla">
      <div className="encabezado">
        <button type="button" className="boton-volver" onClick={onVolver} aria-label="Volver">
          ←
        </button>
        <h2>¿Quiénes juegan?</h2>
      </div>

      <div className="scroll">
        {jugadores.map((jugador, indice) => (
          <div className="panel pila" key={jugador.id}>
            <div className="campo">
              <label htmlFor={`nombre-${jugador.id}`}>Jugador {indice + 1}</label>
              <input
                id={`nombre-${jugador.id}`}
                value={jugador.name}
                maxLength={18}
                autoComplete="off"
                onChange={(e) => actualizar(indice as 0 | 1, { name: e.target.value })}
                placeholder="Nombre"
              />
            </div>

            <div className="campo">
              <label>Género</label>
              <div className="opciones">
                {(['hombre', 'mujer'] as Gender[]).map((genero) => (
                  <button
                    type="button"
                    key={genero}
                    className="opcion"
                    data-activa={jugador.gender === genero}
                    onClick={() => actualizar(indice as 0 | 1, { gender: genero })}
                  >
                    {genero === 'hombre' ? 'Hombre' : 'Mujer'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        <p className="subtitulo">
          El género decide qué cartas tienen sentido para cada uno. Empiezan siempre en nivel 1: el
          nivel lo suben ustedes cuando quieran.
        </p>
      </div>

      <button type="button" className="boton" onClick={empezar}>
        Empezar en nivel 1 ♥
      </button>
    </div>
  );
}
