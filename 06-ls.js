const fs = require ('node:fs/promises') // Importacion CommonJS

// fs.readdir ('.', (err, files) => {
//     if (err) {
//         console.log(err.message)
//         return;
//     }
//     files.forEach (file => {
//         console.log (file)
//     })
// }); Asi es como se hace con callback


// Como se hace con Promises
fs.readdir ('.')
    .then(files => {
        files.forEach (file => {
            console.log (file)
        })
    })
    .catch (err => {
        if (err) {
            console.log(err.message)
            return;
        }
    })