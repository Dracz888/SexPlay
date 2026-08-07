# SexPlay

Juego íntimo para parejas, pensado para jugarse **en un mismo celular** pasándoselo por turnos.
Es una app web instalable (PWA): se abre en el navegador del teléfono, se puede añadir a la pantalla
de inicio y funciona sin internet. Todo se guarda en el propio teléfono; no hay cuentas ni servidor.

Solo para mayores de edad, y solo entre dos personas que consienten.

## Dónde está publicada

**https://dracz888.github.io/SexPlay/**

Ese link se puede abrir desde cualquier celular y pasárselo a quien sea. En el navegador del teléfono,
con «Añadir a pantalla de inicio», queda como una app más y luego abre sin internet.

Cada teléfono guarda **sus propios datos** (límites, cartas propias, partida en curso) en el
almacenamiento interno del navegador. No se comparte nada entre teléfonos ni se sube nada a ningún
servidor.

La publicación es automática: cada push a la rama dispara el workflow `.github/workflows/deploy.yml`,
que construye la app y la sube a GitHub Pages.

**Solo la primera vez**, hay que activar Pages a mano (GitHub no deja que lo haga el propio workflow):
entra a **Settings → Pages** del repositorio y en *Build and deployment* pon **Source: GitHub Actions**.
Después de eso, cada push publica solo.

> Si algún día cambias el nombre del repositorio, hay que cambiar también `BASE_EN_GITHUB_PAGES` en
> `vite.config.ts`, porque la app cuelga de esa ruta.

## Cómo se juega

1. **Advertencia** al abrir. Hay que aceptarla para entrar.
2. **Lista de límites** (solo la primera vez): 22 categorías con un interruptor cada una. Lo que quede
   apagado no sale nunca. Hay botón «Permitir todo». Se puede cambiar después desde Configuración.
3. **Menú**: el corazón del centro empieza la partida.
4. **Nombres y géneros** de los dos jugadores (Hombre o Mujer; por defecto uno de cada).
5. **La partida**:
   - Una barra de **Nivel** del 1 al 5 marca la intensidad. Siempre empieza en 1 y se sube a mano.
   - **Nivel 1**: sin dado, sale directo una carta de nivel 1.
   - **Niveles 2 a 4**: se lanza un dado con tantas caras como el nivel; lo que salga es el nivel de
     la carta.
   - **Nivel 5**: dado de 6 caras. Del 1 al 5 sale carta; con el **6 se gana Intimidad**.
   - Cada carta es una **pregunta** o un **reto**. Se puede cumplir o pasar; pasar no cuesta nada.
6. **Tienda de Intimidad**: los puntos se canjean por solicitudes que la pareja tiene que cumplir.
   Comprar guarda un vale, que se canjea cuando quieran.

## El mazo

565 cartas repartidas en 22 categorías: 10 preguntas y 15 retos por categoría, salvo **Licor**, que
tiene 10 preguntas y 30 retos de bebidas.

Cada carta vive en `src/data/cards/<categoria>.ts` y se escribe como `[nivel, texto]`, con un tercer
campo opcional para etiquetas y género:

```ts
[3, 'Bésale el cuello a {pareja} durante un minuto.'],
[5, 'Penetra a {pareja} por detrás.', { tags: ['anal.penetracion'] }],
[4, 'Chúpasela a {pareja} mirándole a los ojos.', { targetGender: 'hombre' }],
```

- `{pareja}` es el nombre del otro jugador y `{actor}` el de quien tiene el turno.
- `tags` son sub-interruptores de la lista de límites: la carta solo sale si están todos permitidos.
- `targetGender` / `actorGender` evitan que salgan cartas que no aplican.

Desde **Configuración → Preguntas y retos** se pueden ver todas las cartas con filtros y buscador,
eliminar las que no gusten (y recuperarlas) y crear cartas propias. Las categorías están en
`src/data/categories.ts` y la tienda en `src/data/shop.ts`.

## Desarrollo

```bash
npm install
npm run dev          # servidor de desarrollo
npm run build        # comprobación de tipos + build de producción
npm run preview      # sirve el build
npm run check:cards  # conteos por categoría e integridad del mazo
npm run lint
```

Stack: Vite + React + TypeScript, CSS propio, `localStorage`. Sin dependencias de UI.
