// Importacion de modulos con CommonJS
const fs = require ('node:fs/promises') 
const path = require ('node:path')


const folder = process.argv[2] ?? '.' // podemos pasarle como argumentos otros directorios

// Creo una funcion asincrona
async function ls (directory) { 
    let files
    try {
        files = await fs.readdir (folder) // lee los archivos en el diretorio
    } catch { 
        console.error (`\nNo se puede leer directorio: ${folder}`) 
        process.exit(1)
    }
    
    const filePromises = files.map (async file => { // mapeo los archivos
        const filePath = path.join (folder, file) // para crear rutas de archivos
        let fileStats

        try {
            fileStats = await fs.stat (filePath) // obtengo informacion de los archivos
        } catch {
            console.error (`No se pudo leer la informacion del archivos: ${filePath}`)
            process.exit(1)
        }

        const isDirectory = fileStats.isDirectory() // compruebo si es un directorio
        const fileType = isDirectory ? 'd' : 'f'
        const fileSize = fileStats.size // tamaño del archivo
        const fileModified = fileStats.mtime.toLocaleString() // Ultima modificacion del archivo

        return `${fileType} ${file.padEnd(20)} ${fileSize.toString().padStart(10)} ${fileModified}`
    });

    const filesInfo = await Promise.all (filePromises)
    filesInfo.forEach(fileInfo => console.log (fileInfo));
}

ls (folder); // ejecuta la funcion asincrona