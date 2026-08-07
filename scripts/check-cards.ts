/**
 * Revisa el mazo: conteos por categoría, ids repetidos y etiquetas que no existan.
 * Se ejecuta con `npm run check:cards`.
 */
import { ALL_LIMIT_IDS, CATEGORIES } from '../src/data/categories';
import { BASE_CARDS } from '../src/data/cards';

const ESPERADO: Record<string, { preguntas: number; retos: number }> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.id === 'licor' ? { preguntas: 10, retos: 30 } : { preguntas: 10, retos: 15 }]),
);

const limites = new Set(ALL_LIMIT_IDS);
const errores: string[] = [];
const vistos = new Set<string>();

for (const carta of BASE_CARDS) {
  if (vistos.has(carta.id)) errores.push(`Id repetido: ${carta.id}`);
  vistos.add(carta.id);

  if (!limites.has(carta.category)) errores.push(`${carta.id}: categoría desconocida "${carta.category}"`);

  for (const tag of carta.tags ?? []) {
    if (!limites.has(tag)) errores.push(`${carta.id}: etiqueta desconocida "${tag}"`);
  }

  if (carta.level < 1 || carta.level > 5) errores.push(`${carta.id}: nivel fuera de rango`);
  if (!carta.text.trim()) errores.push(`${carta.id}: sin texto`);

  for (const marca of carta.text.match(/\{[a-z]+\}/g) ?? []) {
    if (!['{actor}', '{pareja}', '{a}', '{p}'].includes(marca)) {
      errores.push(`${carta.id}: marca desconocida ${marca}`);
    }
  }
}

console.log('Categoría              Preguntas  Retos  Total');
let total = 0;

for (const categoria of CATEGORIES) {
  const suyas = BASE_CARDS.filter((c) => c.category === categoria.id);
  const preguntas = suyas.filter((c) => c.type === 'pregunta').length;
  const retos = suyas.filter((c) => c.type === 'reto').length;
  total += suyas.length;

  const esperado = ESPERADO[categoria.id];
  const ok = preguntas === esperado.preguntas && retos === esperado.retos;
  if (!ok) {
    errores.push(
      `${categoria.id}: se esperaban ${esperado.preguntas} preguntas y ${esperado.retos} retos, hay ${preguntas} y ${retos}`,
    );
  }

  console.log(
    `${(ok ? '✓ ' : '✗ ') + categoria.id.padEnd(20)} ${String(preguntas).padStart(6)} ${String(retos).padStart(6)} ${String(suyas.length).padStart(6)}`,
  );
}

console.log(`\nTotal de cartas: ${total}`);
console.log(`Por nivel: ${[1, 2, 3, 4, 5].map((n) => `n${n}=${BASE_CARDS.filter((c) => c.level === n).length}`).join('  ')}`);

if (errores.length > 0) {
  console.error(`\n${errores.length} problema(s):`);
  for (const error of errores) console.error(`  - ${error}`);
  process.exit(1);
}

console.log('\nTodo correcto.');
