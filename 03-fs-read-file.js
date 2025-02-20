const fs = require('node:fs'); // importacion de modulo con CommonJS

console.log ('Leyendo el primer archivo...')
fs.readFile('./archivo.txt', 'utf-8', (err , text) => {
    console.log('\n', text)
}); // Forma asincrona de leer el archivo con Callback


console.log ('Hacer otra cosa mietras...')

console.log ('Leyendo el segundo archivo...')
const secondText = fs.readFileSync ('./archivo2.txt', 'utf-8',); // Forma Sincrona de leer el archivo
console.log ('\n', secondText)