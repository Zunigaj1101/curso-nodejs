const { readFile } = require('node:fs/promises'); // Importación de readFile desde fs/promises

Promise.all([
    readFile('./archivo.txt', 'utf-8'), // Primera Promesa: Leer el archivo 'archivo.txt'
    readFile('./archivo2.txt', 'utf-8') // Segunda Promesa: Leer el archivo 'archivo2.txt'
])
.then(([text, secondText]) => { // Cuando ambas Promesas se cumplen
    console.log(text); // Imprime el contenido del primer archivo
    console.log(secondText); // Imprime el contenido del segundo archivo
})
.catch((error) => {
    console.error('Error al leer los archivos:', error.message); // Manejo de errores si alguna Promesa falla
});