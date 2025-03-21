const path = require('node:path') // Importacion CommonJS

// Barras de rutas
// Unix ===> /
// Windows ===> \

// Ver barras de rutas de tu OS
console.log(path.sep) 

// ejemplo: \user\download\test.txt
const filePath = path.join('user','download','test.txt');
// path.join para crear rutas de archivos

console.log(filePath);

const fileName = path.basename(filePath); // me muestras el nombre del archivo
console.log(fileName);

const extension = path.extname (filePath); // para mostrar la extension de un archivo
console.log (extension)