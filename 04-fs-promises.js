const fs = require('node:fs/promises'); // importacion CommonJS con Promesas

console.log ('Leyendo el primer archivo...')
fs.readFile ('./archivo.txt', 'utf-8')
    .then (text => console.log ('\nPrimer texto: ',text)) // Asincrona con promesas

console.log ('Hacer otra cosa mietras...')

console.log ('Leyendo el segundo archivo...')
fs.readFile ('./archivo2.txt', 'utf-8')
    .then (text => {
        console.log ('\nSegundo texto: ', text)
    }) // Asincrona con promesas