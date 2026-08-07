import { useState } from 'react';

export function AdvertenciaScreen({ onAceptar }: { onAceptar: () => void }) {
  const [aunNo, setAunNo] = useState(false);

  if (aunNo) {
    return (
      <div className="pantalla pantalla--centro">
        <div className="corazon-envoltura">
          <span style={{ fontSize: 64 }}>♥</span>
        </div>
        <h2 className="titulo-marca">Otro día será</h2>
        <p className="subtitulo">
          No pasa nada. Este juego solo funciona cuando los dos quieren de verdad.
          Cierra la app y vuelvan cuando estén listos.
        </p>
        <button type="button" className="boton boton--fantasma" onClick={() => setAunNo(false)}>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="pantalla pantalla--centro">
      <h1 className="titulo-marca">SexPlay</h1>

      <div className="advertencia">
        Advertencia: no jugar si no has desarrollado profunda intimidad con tu pareja
      </div>

      <p className="texto">
        Bienvenidos a SexPlay. El juego íntimo dónde podrán explorar toda clases de intereses con tu
        pareja. Antes de empezar debemos saber hasta dónde están <strong>DISPUESTOS A LLEGAR</strong>.
      </p>

      <p className="texto" style={{ fontWeight: 700 }}>
        ¿Están listos para el juego?
      </p>

      <div className="botonera">
        <button type="button" className="boton" onClick={onAceptar}>
          Sí, estamos listos ♥
        </button>
        <button type="button" className="boton boton--fantasma" onClick={() => setAunNo(true)}>
          Aún no
        </button>
      </div>

      <p className="subtitulo">
        Solo para mayores de edad. Todo lo que pase aquí se queda en este teléfono.
      </p>
    </div>
  );
}
