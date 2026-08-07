import { useMemo } from 'react';

/** Corazones que suben despacio de fondo en todas las pantallas. */
export function Corazones({ cantidad = 14 }: { cantidad?: number }) {
  const corazones = useMemo(
    () =>
      Array.from({ length: cantidad }, (_, i) => ({
        id: i,
        left: `${(i * 97) % 100}%`,
        size: `${16 + ((i * 13) % 26)}px`,
        duration: `${14 + ((i * 7) % 16)}s`,
        delay: `${-(i * 3) % 20}s`,
      })),
    [cantidad],
  );

  return (
    <div className="corazones" aria-hidden="true">
      {corazones.map((c) => (
        <span
          key={c.id}
          style={{
            left: c.left,
            fontSize: c.size,
            animationDuration: c.duration,
            animationDelay: c.delay,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}
