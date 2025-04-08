import express from "express";
import logger from 'morgan';
import { Server } from "socket.io";
import { createServer } from "http";

const port = process.env.PORT ?? 1234

const app = express()
const server = createServer(app) // Crear el servidor HTTP
const io = new Server (server) // Integrar Socket.IO con el servidor HTTP

app.use(logger('dev'))

// el Socket escucha la conexion de un usuario
io.on('connection', (socket) => {
    console.log ('a user has connected')

    // escucha la desconexión de un usario
    socket.on('disconnect', () => {
        console.log ('A user disconnected')
    })

    // Escucha los mesaje de los usuarios
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg)
    })
})

app.get('/',(req, res) => {
    res.sendFile(process.cwd() + "/client/index.html")
})

server.listen (port, () => {
    console.log (`Sever running on port: http://localhost:${port}`)
})