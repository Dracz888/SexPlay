# Publicar SexPlay en Google Play

Guía de lo que hay que tener en cuenta y lo que hay que hacer, en orden.

Léela entera antes de pagar nada: **el primer punto puede cambiar toda la decisión.**

---

## 1. El problema grande: la política de contenido sexual

Google Play **prohíbe explícitamente** este tipo de app. La política de *Contenido
inapropiado → Contenido sexual y lenguaje soez* dice que no se permiten apps que
contengan o promuevan:

- contenido «destinado a la gratificación sexual» (*intended to be sexually gratifying*),
- «guías de sexo» y «fetiches»,
- «contenido obsceno con texto explícito o palabras clave sexuales».

SexPlay encaja en las tres. No es un caso dudoso:

| Lo que tiene la app | Lo que dice la política |
|---|---|
| El propósito declarado es excitar a la pareja | «intended to be sexually gratifying» — prohibido |
| Cartas con lenguaje explícito («verga», «chupársela», «penetra») | «explicit text or adult/sexual keywords» — prohibido |
| Categorías Anal, Ataduras, Azotes, Dominación, Humillación, Plug | «fetishes» — prohibido |
| El nombre **SexPlay** y el icono | Los metadatos (título, icono, descripción) tampoco pueden ser sexualmente explícitos |

Las excepciones que existen (educativo, documental, científico o artístico) no aplican
aquí, y no hay una categoría «solo adultos» en Play que legalice esto: la clasificación
*Mature 17+* sirve para contenido **sugerente**, no explícito.

### Por qué importa el riesgo, no solo el rechazo

Insistir tiene costo real. Play cierra cuentas de desarrollador por violaciones
repetidas, y cuando cierran una cuenta suelen cerrar también las cuentas de Google
asociadas a la misma persona. Se pierden los 25 USD y la posibilidad de publicar
cualquier otra app en el futuro con ese nombre. **No conviene subirla «a ver qué pasa».**

---

## 2. Las tres rutas posibles

### Ruta A — Versión suavizada en Play (la única que Play acepta)

Existe un género entero de apps de pareja que sí viven en Play: preguntas y retos
**sugerentes pero no explícitos**. Para llegar ahí habría que:

1. **Cambiar el nombre.** «SexPlay» no pasa el filtro de metadatos. Algo como
   *Chispa*, *A Solas*, *Modo Pareja*, *Juego de Dos*.
2. **Reescribir o filtrar el mazo.** Fuera el vocabulario explícito y las categorías
   de fetiche. Lo que queda: besos, masajes, striptease, sensorial, preguntas
   picantes, licor, dirty talk suave. Aproximadamente la mitad del mazo actual,
   reescrita.
3. **Icono y capturas** sin nada explícito.
4. Clasificación **Mature 17+**, sin anuncios, sin público infantil.

La app explícita completa seguiría existiendo como PWA en el link de siempre.

### Ruta B — Fuera de Play, con la app completa

- **PWA como ahora** (`https://dracz888.github.io/SexPlay/`): funciona hoy, se instala
  en la pantalla de inicio, no depende de nadie. Es lo que ya tienes.
- **APK de descarga directa** desde una web propia o itch.io (itch.io sí permite
  contenido adulto).
- Ojo con el cambio de Android: desde septiembre de 2026 (Brasil, Indonesia, Singapur,
  Tailandia) y globalmente en 2027, instalar un APK en un teléfono certificado exige
  que el desarrollador esté **verificado con identidad real** ante Google. Hay una
  «Limited Distribution Account» para hobbyistas. O sea: el APK suelto también se va a
  complicar, y la PWA queda como la vía más libre a largo plazo.

### Ruta C — Las dos

Publicar la versión suavizada en Play (alcance, descubrimiento, credibilidad) y
mantener la explícita como PWA. Dentro de la app de Play **no se puede** poner un link
del tipo «desbloquea la versión completa aquí» — eso también viola la política.

**Recomendación:** si el objetivo es que la gente la encuentre y la instale fácil, Ruta C.
Si el objetivo es la app tal como está hoy, Play no es el canal; quédate con la PWA.

---

## 3. Lo administrativo (aplica a cualquier versión que se suba)

| Requisito | Detalle |
|---|---|
| Cuenta de Play Console | 25 USD, pago único |
| Verificación de identidad | Documento oficial. Cuenta **personal**: datos personales. Cuenta de **organización**: hace falta número D-U-N-S |
| Prueba cerrada obligatoria | Cuentas personales creadas después del 13-nov-2023: **12 testers reales opted-in durante 14 días seguidos** antes de poder pasar a producción. Esto no se salta: hay que conseguir 12 personas con cuenta de Google que instalen y usen la app dos semanas |
| Política de privacidad | **URL pública obligatoria.** Se puede publicar como página en el mismo GitHub Pages |
| Verificación de desarrollador | El registro de identidad y de la clave de firma que Google exige desde 2026 |

Presupuesta unas **3 a 5 semanas** desde que empiezas hasta estar en producción, casi
todo esperando los 14 días de prueba cerrada y las revisiones.

---

## 4. Convertir la PWA en app Android

La app es 100 % offline: no hace ni una llamada de red, todo vive en `localStorage`.
Eso hace que la mejor opción sea empaquetarla **entera dentro del APK**.

### Opción recomendada: Capacitor

Mete el `dist/` dentro de la app nativa. No depende de GitHub Pages, funciona sin
internet desde el primer segundo y no hay que verificar ningún dominio.

```bash
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli
npx cap init SexPlay com.tudominio.sexplay --web-dir=dist
npx cap add android
npm run build && npx cap sync android
```

Después se abre `android/` con Android Studio y desde ahí se genera el **AAB** firmado
(Play ya no acepta APK, solo Android App Bundle).

### Por qué no TWA / Bubblewrap

Un TWA carga la web real dentro de la app y exige un archivo `assetlinks.json` en la
**raíz del dominio**. Como la app vive en `dracz888.github.io/SexPlay/` (una página de
proyecto), habría que crear otro repositorio solo para la raíz del dominio, y la app
quedaría dependiendo de que Pages siga en línea. Más frágil, sin ninguna ventaja aquí.

### Cambios necesarios en el código

1. **`vite.config.ts`** — el `base: '/SexPlay/'` rompe la app dentro de Capacitor.
   Hay que añadir un modo de build con `base: './'` para Android, sin tocar el de Pages.
2. **Service worker** — dentro de Capacitor sobra y puede dejar caché vieja pegada.
   Conviene no registrarlo en el build de Android (`src/main.tsx`).
3. **`targetSdk 36`** — desde el 31-ago-2026 las apps nuevas deben apuntar a Android 16.
4. **Edge-to-edge** — obligatorio desde targetSdk 35. El CSS ya usa
   `env(safe-area-inset-*)` en `app.css`, así que está casi resuelto; hay que probarlo
   en un teléfono con barra de gestos.
5. **Botón atrás físico** — hoy la navegación es por estado de React. En Android, el
   botón atrás cerraría la app de golpe. Hay que engancharlo para que vuelva a la
   pantalla anterior.
6. **Puerta de edad** — la pantalla de advertencia actual pregunta «¿están listos?».
   Para contenido adulto conviene una confirmación de mayoría de edad explícita.

---

## 5. La ficha de la tienda

Material gráfico:

- **Icono**: PNG de 512 × 512 (el `icon.svg` actual hay que exportarlo).
- **Gráfico de funciones**: 1024 × 500, obligatorio.
- **Capturas**: mínimo 2 de teléfono (recomendado 4-8), entre 320 y 3840 px de lado.
- Icono adaptativo de Android (foreground + background) dentro del proyecto nativo.

Textos:

- **Descripción corta**: 80 caracteres.
- **Descripción completa**: hasta 4000.
- Ninguno de los dos puede tener lenguaje sexual explícito.

Formularios de Play Console:

| Formulario | Qué poner en esta app |
|---|---|
| **Clasificación de contenido (IARC)** | Cuestionario. Hay que responder con honestidad — mentir es causa de retirada. Con contenido sugerente da *Mature 17+* |
| **Seguridad de los datos** | «No se recopilan datos». Es verdad: no hay red, no hay analytics, todo en el teléfono |
| **Público objetivo** | Solo 18+. Nunca marcar público infantil ni entrar en Designed for Families |
| **Anuncios** | No contiene anuncios |
| **Acceso a la app** | Sin login, todo el contenido accesible |
| **Menores declarados** | Activar «Restrict Declared Minors» |

---

## 6. Firma y claves

- Se genera un **keystore** propio (la clave de subida) y **no se pierde nunca**:
  sin él no se puede volver a actualizar la app.
- Guárdalo fuera del repositorio y con copia de seguridad. **Nunca** lo subas a Git.
- Play App Signing se encarga de la clave final de distribución.
- El **nombre del paquete** (`com.tudominio.sexplay`) es permanente: no se puede cambiar
  después de publicar.

---

## 7. Checklist

**Decisión previa**
- [ ] Elegir ruta (A suavizada / B fuera de Play / C ambas)
- [ ] Si es A o C: nombre nuevo y criterio de qué cartas se quedan

**Cuenta**
- [ ] Play Console creada y pagada (25 USD)
- [ ] Identidad verificada
- [ ] 12 testers conseguidos para la prueba cerrada

**Técnico**
- [ ] Capacitor instalado y proyecto Android generado
- [ ] `base` de Vite corregida para Android
- [ ] Service worker desactivado en el build de Android
- [ ] Botón atrás enganchado
- [ ] targetSdk 36 y edge-to-edge probados en teléfono
- [ ] Puerta de edad 18+
- [ ] Keystore generado y respaldado
- [ ] AAB firmado generado

**Ficha**
- [ ] Icono 512×512, gráfico 1024×500, capturas
- [ ] Descripción corta y completa
- [ ] Política de privacidad publicada y con URL
- [ ] Clasificación de contenido, seguridad de datos, público objetivo, anuncios

**Publicación**
- [ ] Prueba cerrada: 12 testers × 14 días
- [ ] Solicitar acceso a producción
- [ ] Enviar a revisión
