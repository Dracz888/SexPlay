import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * En producción la app vive en https://<usuario>.github.io/SexPlay/, así que
 * todas las rutas cuelgan de /SexPlay/. Si algún día cambia el nombre del
 * repositorio, hay que cambiar este valor por el nombre nuevo.
 */
const BASE_EN_GITHUB_PAGES = '/SexPlay/';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? BASE_EN_GITHUB_PAGES : '/',
  plugins: [react()],
}));
