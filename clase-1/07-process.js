// Process
// console.log (process.argv)

// Controlar el proceso y su salida
// process.exit(0) // 0 todo a ido bien, 1 ha habido un error.

// // podemos controlar los eventos del proceso
// process.on ('exit', () => {
// // limpiar los recursos
// })

// Current working directory
console.log (process.cwd()) // muestra desdeque carpeta se esta trabajando

// Platform
console.log(process.env.NODE_ENV) // variables de entorno