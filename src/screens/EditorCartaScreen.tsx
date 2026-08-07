import { useState } from 'react';
import { CATEGORIES } from '../data/categories';
import { useGame } from '../state/GameContext';
import type { CardType, Gender, Level, PlayCard } from '../types';

interface Props {
  carta: PlayCard | null;
  onListo: () => void;
}

type Requisito = 'nadie' | 'hombre' | 'mujer';

export function EditorCartaScreen({ carta, onListo }: Props) {
  const { dispatch } = useGame();
  const [texto, setTexto] = useState(carta?.text ?? '');
  const [tipo, setTipo] = useState<CardType>(carta?.type ?? 'reto');
  const [nivel, setNivel] = useState<Level>(carta?.level ?? 1);
  const [categoria, setCategoria] = useState(carta?.category ?? CATEGORIES[0].id);
  const [requisito, setRequisito] = useState<Requisito>(
    carta?.targetGender ? (carta.targetGender as Requisito) : 'nadie',
  );

  const guardar = () => {
    const limpio = texto.trim();
    if (!limpio) return;

    const nueva: PlayCard = {
      id: carta?.id ?? `propia-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      category: categoria,
      type: tipo,
      level: nivel,
      text: limpio,
      custom: true,
      ...(requisito === 'nadie' ? {} : { targetGender: requisito as Gender }),
    };

    dispatch({ type: 'cards/save', card: nueva });
    onListo();
  };

  return (
    <div className="pantalla">
      <div className="encabezado">
        <button type="button" className="boton-volver" onClick={onListo} aria-label="Volver">
          ←
        </button>
        <h2>{carta ? 'Editar carta' : 'Carta nueva'}</h2>
      </div>

      <div className="scroll">
        <div className="campo">
          <label htmlFor="texto-carta">Texto</label>
          <textarea
            id="texto-carta"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Ej: Bésale el cuello a {pareja} durante un minuto."
            maxLength={400}
          />
          <p className="contador">
            Escribe <strong>{'{pareja}'}</strong> donde quieras que salga el nombre del otro, y{' '}
            <strong>{'{actor}'}</strong> para el nombre de quien tiene el turno.
          </p>
        </div>

        <div className="campo">
          <label>Tipo</label>
          <div className="opciones">
            {(['pregunta', 'reto'] as CardType[]).map((t) => (
              <button
                type="button"
                key={t}
                className="opcion"
                data-activa={tipo === t}
                onClick={() => setTipo(t)}
              >
                {t === 'pregunta' ? 'Pregunta' : 'Reto'}
              </button>
            ))}
          </div>
        </div>

        <div className="campo">
          <label>Nivel de intensidad</label>
          <div className="opciones">
            {([1, 2, 3, 4, 5] as Level[]).map((n) => (
              <button
                type="button"
                key={n}
                className="opcion"
                data-activa={nivel === n}
                onClick={() => setNivel(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="campo">
          <label htmlFor="categoria-carta">Categoría</label>
          <select
            id="categoria-carta"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            style={{
              background: 'rgba(26, 2, 9, 0.6)',
              border: '1px solid var(--borde)',
              borderRadius: 'var(--radio-chico)',
              padding: '13px 14px',
              fontSize: 16,
            }}
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <p className="contador">
            Si esa categoría está apagada en la lista de límites, la carta no va a salir.
          </p>
        </div>

        <div className="campo">
          <label>Solo si la pareja es</label>
          <div className="opciones">
            {(['nadie', 'hombre', 'mujer'] as Requisito[]).map((r) => (
              <button
                type="button"
                key={r}
                className="opcion"
                data-activa={requisito === r}
                onClick={() => setRequisito(r)}
              >
                {r === 'nadie' ? 'Cualquiera' : r === 'hombre' ? 'Hombre' : 'Mujer'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button type="button" className="boton" onClick={guardar} disabled={!texto.trim()}>
        Guardar carta ♥
      </button>
    </div>
  );
}
