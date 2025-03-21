// Protocolo Net
const net = require ('node:net') // importacion con CommonJS

// Funcion para encontrar un puerto libre
function findAvailablePort (desiredPort) {
    return new Promise ((resolve, reject) => {
        const server = net.createServer()

        server.listen(desiredPort, () => {
            const port = server.address().port
            server.close (() => {
                resolve(port)
            })
        })
        server.on ('error', (error) => {
            if (error.code == 'EADDRINUSE') {
                findAvailablePort (0).then ( port => resolve (port))
            } else {
                reject(error)
            }
        })
    })
}

// Exportacion de la funcion
module.exports = {findAvailablePort}