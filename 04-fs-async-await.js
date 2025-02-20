const fs = require('node:fs/promises'); // importacion CommonJS con Promesas

//IIFE Inmediaty Invoked Function Expression

async function init() { // Definición de una función asíncrona anónima
    console.log ('Leyendo el primer archivo...')
    const text = await fs.readFile ('./archivo.txt', 'utf-8')
    console.log ('\n', text)

    console.log ('Hacer otra cosa mietras...')
    console.log ('Leyendo el segundo archivo...')
    const secondText = await fs.readFile ('./archivo2.txt', 'utf-8')
    console.log ('\n', secondText)
}; init(); // Llamada inmediata a la función
