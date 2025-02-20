import { readFile } from 'node:fs/promises'; // importacion ES module con Promesas

console.log ('Leyendo el primer archivo...')
const text = await readFile ('./archivo.txt', 'utf-8')
console.log ('\n', text)

console.log ('Hacer otra cosa mietras...')

console.log ('Leyendo el segundo archivo...')
const secondText = await readFile ('./archivo2.txt', 'utf-8')
console.log ('\n', secondText)