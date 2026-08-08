# SexPlay

Juego íntimo pensado para jugarse **en un mismo celular** pasándoselo por turnos. Tiene dos modos:
**Pareja** (dos personas) y **Fiesta** (de 3 a 12), donde el juego reparte a quién le toca en cada carta.
Es una app web instalable (PWA): se abre en el navegador del teléfono, se puede añadir a la pantalla
de inicio y funciona sin internet. Todo se guarda en el propio teléfono; no hay cuentas ni servidor.

Solo para mayores de edad, y solo entre personas que consienten.

## Dónde está publicada

**https://dracz888.github.io/SexPlay/**

Ese link se puede abrir desde cualquier celular y pasárselo a quien sea. En el navegador del teléfono,
con «Añadir a pantalla de inicio», queda como una app más y luego abre sin internet.

Cada teléfono guarda **sus propios datos** (límites, cartas propias, partida en curso) en el
almacenamiento interno del navegador. No se comparte nada entre teléfonos ni se sube nada a ningún
servidor.

Desde **Configuración → Copia de seguridad** se pueden **exportar** esos datos a un archivo y volver a
**importarlos** después: sirve para no perderlos al cambiar de teléfono y para pasarle tu
configuración a otro celular.

La publicación es automática: cada push a la rama dispara el workflow `.github/workflows/deploy.yml`,
que construye la app y la sube a GitHub Pages.

**Solo la primera vez**, hay que activar Pages a mano (GitHub no deja que lo haga el propio workflow):
entra a **Settings → Pages** del repositorio y en *Build and deployment* pon **Source: GitHub Actions**.
Después de eso, cada push publica solo.

> Si algún día cambias el nombre del repositorio, hay que cambiar también `BASE_EN_GITHUB_PAGES` en
> `vite.config.ts`, porque la app cuelga de esa ruta.

## Cómo se juega

1. **Advertencia** al abrir. Hay que aceptarla para entrar.
2. **Lista de límites** (solo la primera vez): 23 categorías con un interruptor cada una. Lo que quede
   apagado no sale nunca. Hay botón «Permitir todo». Se puede cambiar después desde Configuración.
3. **Menú**: el corazón del centro empieza la partida.
4. **Modo de juego**: **Pareja** o **Fiesta**.
5. **Quiénes juegan**:
   - En **Pareja**, nombre y género de los dos (Hombre o Mujer; por defecto uno de cada).
   - En **Fiesta**, se agrega toda la gente que quieran (de 3 a 12) con su nombre y género, y se
     elige el **reparto**: **Hetero** (a cada quien solo le puede tocar con alguien del sexo opuesto)
     o **Mix** (le puede tocar con cualquiera).
6. **La partida**:
   - Una barra de **Nivel** del 1 al 5 marca la intensidad. Siempre empieza en 1 y se sube a mano.
   - **Nivel 1**: sin dado, sale directo una carta de nivel 1.
   - **Niveles 2 a 4**: se lanza un dado con tantas caras como el nivel; lo que salga es el nivel de
     la carta.
   - **Nivel 5**: dado de 6 caras. Del 1 al 5 sale carta; con el **6 se gana Intimidad**.
   - Cada carta es una **pregunta** o un **reto**. Se puede cumplir o pasar; pasar no cuesta nada.
   - En **Fiesta**, cada carta dice además **a quién le toca**: el juego lo reparte respetando el
     modo Hetero o Mix, el género que pida la carta y cuánta gente haya en la mesa.
7. **Tienda de Intimidad**: los puntos se canjean por solicitudes. En Pareja las cumple el otro; en
   Fiesta, quien compró el vale elige a quién de la mesa se lo pide.

## El mazo

755 cartas repartidas en 23 categorías: 10 preguntas y 15 retos por categoría, salvo **Licor**
(10 preguntas y 30 retos de bebidas) y **Fiesta** (70 preguntas y 120 retos de grupo).

**Fiesta** es una categoría aparte, marcada como *Solo en Fiesta*: sus cartas nunca salen en el modo
Pareja porque hablan de tres personas o más (besos de tres, parejas cruzadas, retos delante del
grupo). Si en el modo Fiesta se activan además otras categorías, **entran todas**: el mazo de fiesta
se suma al de siempre.

Cada carta vive en `src/data/cards/<categoria>.ts` y se escribe como `[nivel, texto]`, con un tercer
campo opcional para etiquetas, género y gente mínima:

```ts
[3, 'Bésale el cuello a {pareja} durante un minuto.'],
[5, 'Penetra a {pareja} por detrás.', { tags: ['anal.penetracion'] }],
[4, 'Chúpasela a {pareja} mirándole a los ojos.', { targetGender: 'hombre' }],
[3, 'Beso de tres: {pareja}, {otro} y tú a la vez.', { tags: ['fiesta.besos'], pairing: 'mix' }],
[5, 'Intercambio de parejas por lo que queda de la noche.', { minPlayers: 4 }],
```

- `{actor}` es quien tiene el turno y `{pareja}` a quien le tocó. En Fiesta se pueden usar además
  `{otro}` y `{otro2}` para meter a una tercera y a una cuarta persona de la mesa.
- `{a}`, `{p}`, `{o}` y `{o2}` son la terminación de género de cada uno: `desnud{a}` sale como
  «desnudo» o «desnuda» según quien juegue.
- `tags` son sub-interruptores de la lista de límites: la carta solo sale si están todos permitidos.
- `targetGender` / `actorGender` evitan que salgan cartas que no aplican.
- `minPlayers` exige gente en la mesa cuando el texto no la nombra; `pairing` limita la carta a
  Hetero o a Mix.

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
