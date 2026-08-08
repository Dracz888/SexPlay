import type { ReactNode } from 'react';

interface Props {
  titulo: string;
  children?: ReactNode;
  confirmar: string;
  onConfirmar: () => void;
  /** Apaga el botón de confirmar mientras falte algo por rellenar. */
  confirmarActivo?: boolean;
  cancelar?: string;
  onCancelar?: () => void;
}

export function Modal({
  titulo,
  children,
  confirmar,
  onConfirmar,
  confirmarActivo = true,
  cancelar,
  onCancelar,
}: Props) {
  return (
    <div className="modal-fondo" role="dialog" aria-modal="true" aria-label={titulo}>
      <div className="modal">
        <h3>{titulo}</h3>
        {children}
        <div className="botonera">
          <button type="button" className="boton" onClick={onConfirmar} disabled={!confirmarActivo}>
            {confirmar}
          </button>
          {cancelar && onCancelar && (
            <button type="button" className="boton boton--fantasma" onClick={onCancelar}>
              {cancelar}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
