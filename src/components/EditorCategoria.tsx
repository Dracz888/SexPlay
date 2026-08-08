import { useState } from 'react';
import {
  DEFAULT_CATEGORY_HINT,
  cleanCategoryHint,
  cleanCategoryLabel,
  newCategoryId,
} from '../data/categories';
import { useGame } from '../state/GameContext';
import type { Category } from '../types';
import { MAX_CATEGORY_HINT, MAX_CATEGORY_LABEL } from '../types';
import { Modal } from './Modal';

interface Props {
  /** La categoría que se está cambiando de nombre, o null para crear una nueva. */
  categoria: Category | null;
  /** Se llama con el id de la categoría guardada. */
  onGuardada: (id: string) => void;
  onCancelar: () => void;
}

/** Ventana para crear una categoría propia o cambiarle el nombre a una que ya existe. */
export function EditorCategoria({ categoria, onGuardada, onCancelar }: Props) {
  const { state, dispatch, categories } = useGame();
  const [nombre, setNombre] = useState(categoria?.label ?? '');
  const [descripcion, setDescripcion] = useState(categoria?.hint ?? '');

  const limpio = cleanCategoryLabel(nombre);

  // Dos categorías con el mismo nombre serían imposibles de distinguir en las listas.
  const repetida = categories.some(
    (c) => c.id !== categoria?.id && c.label.toLowerCase() === limpio.toLowerCase(),
  );

  const guardar = () => {
    if (!limpio || repetida) return;

    const nueva: Category = {
      id: categoria?.id ?? newCategoryId(limpio, state.customCategories),
      label: limpio,
      hint: cleanCategoryHint(descripcion) || DEFAULT_CATEGORY_HINT,
      custom: true,
    };

    dispatch({ type: 'categories/save', category: nueva });
    onGuardada(nueva.id);
  };

  return (
    <Modal
      titulo={categoria ? 'Cambiar la categoría' : 'Categoría nueva'}
      confirmar={categoria ? 'Guardar cambios' : 'Crear categoría'}
      confirmarActivo={Boolean(limpio) && !repetida}
      onConfirmar={guardar}
      cancelar="Cancelar"
      onCancelar={onCancelar}
    >
      <div className="pila">
        <div className="campo">
          <label htmlFor="nombre-categoria">Nombre</label>
          <input
            id="nombre-categoria"
            value={nombre}
            maxLength={MAX_CATEGORY_LABEL}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Juegos de agua"
            autoFocus
          />
          {repetida && <p className="contador">Ya tienen una categoría con ese nombre.</p>}
        </div>

        <div className="campo">
          <label htmlFor="hint-categoria">De qué va (opcional)</label>
          <input
            id="hint-categoria"
            value={descripcion}
            maxLength={MAX_CATEGORY_HINT}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Se lee en la lista de límites"
          />
        </div>

        {!categoria && (
          <p className="contador">
            Entra permitida en la lista de límites y sale en las partidas de dos personas o más.
            Pueden apagarla cuando quieran desde Configuración.
          </p>
        )}
      </div>
    </Modal>
  );
}
