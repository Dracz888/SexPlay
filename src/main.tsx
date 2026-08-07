import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { GameProvider } from './state/GameContext';
import './styles/theme.css';
import './styles/app.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </StrictMode>,
);

// Le pedimos al navegador que trate los datos como permanentes, para que no los
// borre solo cuando le falte espacio. Si dice que no, se guardan igual, solo que
// sin esa garantía.
if (navigator.storage?.persist) {
  navigator.storage.persist().catch(() => {
    // Nada que hacer: los datos siguen guardándose en el teléfono.
  });
}

// La app se instala en la pantalla de inicio y funciona sin internet.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // Sin service worker la app sigue funcionando, solo que necesita conexión la primera vez.
    });
  });
}
