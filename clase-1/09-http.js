// Protocolo HTTP
const http = require ('node:http') // impotacion del modulo http
const {findAvailablePort} = require ('./10-free-port.js')

const desiredPort = process.env.PORT ?? 3000

// creacion del servidor
// req = request (pedido)
// res = response (respuesta)
const server = http.createServer ((req,res) => {
    console.log ('request received') // respuesta del lado del servidor
    res.end('Hola Mundo esta es una prueba') // respuesta del cliente
})

findAvailablePort (desiredPort).then (port => {
    server.listen (port, () => {
        console.log (`request listening on port http://localhost:${port}`)
    })
})

// // para indicar el puerto que escuchara el servidor
// // 0 para indicar que escucha el primer puerto libre (recomendable solo para modo desarrollo)
// server.listen (0, () => {
//     console.log (`request listening on port http://localhost:${server.address().port}`)
// }) 