import { useState } from 'react';
import { Corazones } from './components/Corazones';
import { EditorCartaScreen } from './screens/EditorCartaScreen';
import { GestorCartasScreen } from './screens/GestorCartasScreen';
import { JuegoScreen } from './screens/JuegoScreen';
import { LimitesScreen } from './screens/LimitesScreen';
import { MenuScreen } from './screens/MenuScreen';
import { SetupScreen } from './screens/SetupScreen';
import { SolicitudesScreen } from './screens/SolicitudesScreen';
import { ConfiguracionScreen } from './screens/ConfiguracionScreen';
import { TiendaScreen } from './screens/TiendaScreen';
import { AdvertenciaScreen } from './screens/AdvertenciaScreen';
import { useGame } from './state/GameContext';
import type { PlayCard } from './types';

export type Pantalla =
  | 'advertencia'
  | 'limites'
  | 'menu'
  | 'setup'
  | 'juego'
  | 'tienda'
  | 'configuracion'
  | 'cartas'
  | 'editor'
  | 'solicitudes';

export function App() {
  const { state } = useGame();
  const [pantalla, setPantalla] = useState<Pantalla>('advertencia');
  /** Vuelta atrás desde la lista de límites: cambia si venimos del inicio o de configuración. */
  const [volverDeLimites, setVolverDeLimites] = useState<Pantalla>('menu');
  const [cartaEnEdicion, setCartaEnEdicion] = useState<PlayCard | null>(null);

  const irALimites = (desde: Pantalla) => {
    setVolverDeLimites(desde);
    setPantalla('limites');
  };

  const editarCarta = (carta: PlayCard | null) => {
    setCartaEnEdicion(carta);
    setPantalla('editor');
  };

  return (
    <>
      <Corazones />

      {pantalla === 'advertencia' && (
        <AdvertenciaScreen
          onAceptar={() => {
            if (state.onboardingDone) {
              setPantalla('menu');
            } else {
              irALimites('menu');
            }
          }}
        />
      )}

      {pantalla === 'limites' && (
        <LimitesScreen
          primeraVez={!state.onboardingDone}
          onListo={() => setPantalla(volverDeLimites)}
        />
      )}

      {pantalla === 'menu' && (
        <MenuScreen
          onJugar={() => setPantalla(state.session ? 'juego' : 'setup')}
          onNuevaPartida={() => setPantalla('setup')}
          onConfiguracion={() => setPantalla('configuracion')}
        />
      )}

      {pantalla === 'setup' && (
        <SetupScreen onEmpezar={() => setPantalla('juego')} onVolver={() => setPantalla('menu')} />
      )}

      {pantalla === 'juego' && (
        <JuegoScreen
          onSalir={() => setPantalla('menu')}
          onTienda={() => setPantalla('tienda')}
          onLimites={() => irALimites('juego')}
        />
      )}

      {pantalla === 'tienda' && (
        <TiendaScreen onVolver={() => setPantalla(state.session ? 'juego' : 'menu')} />
      )}

      {pantalla === 'configuracion' && (
        <ConfiguracionScreen
          onVolver={() => setPantalla('menu')}
          onLimites={() => irALimites('configuracion')}
          onCartas={() => setPantalla('cartas')}
          onSolicitudes={() => setPantalla('solicitudes')}
          onBorrarTodo={() => setPantalla('advertencia')}
        />
      )}

      {pantalla === 'cartas' && (
        <GestorCartasScreen
          onVolver={() => setPantalla('configuracion')}
          onNueva={() => editarCarta(null)}
          onEditar={editarCarta}
        />
      )}

      {pantalla === 'editor' && (
        <EditorCartaScreen carta={cartaEnEdicion} onListo={() => setPantalla('cartas')} />
      )}

      {pantalla === 'solicitudes' && <SolicitudesScreen onVolver={() => setPantalla('configuracion')} />}
    </>
  );
}
