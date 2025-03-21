// Protocolo HTTP
const http = require ('node:http'); // impotacion del modulo http

const desiredPort = process.env.PORT ?? 1234
const processRequest = ((req,res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    if (req.url == '/') {
        res.statusCode = 200 // ok
        res.end('Hola mundo esta es una pruebaá') // respuesta del cliente
    } else if  (req.url == '/contacto') {
        res.statusCode = 200 // ok
        res.end('Pagina de contacto') // respuesta del cliente
    } else {
        res.statusCode = 404 // ok
        res.end('ERROR:404') // respuesta del cliente
    }
})

const server = http.createServer (processRequest)

server.listen (desiredPort, () => {
    const port = server.address().port
    console.log (`server listening on port http://localhost:${port}`)
})