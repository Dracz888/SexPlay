interface Props {
  activo: boolean;
  onChange: (valor: boolean) => void;
  etiqueta: string;
  chico?: boolean;
}

export function Interruptor({ activo, onChange, etiqueta, chico }: Props) {
  return (
    <button
      type="button"
      className={chico ? 'interruptor interruptor--chico' : 'interruptor'}
      data-on={activo}
      role="switch"
      aria-checked={activo}
      aria-label={etiqueta}
      onClick={() => onChange(!activo)}
    />
  );
}
