import express from "express";
import logger from 'morgan';
import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";
import { createClient } from "@libsql/client";

dotenv.config()

const port = process.env.PORT ?? 1234

const app = express()
const server = createServer(app) // Crear el servidor HTTP
const io = new Server (server) // Integrar Socket.IO con el servidor HTTP

const db = createClient ({
    url: "libsql://solid-starbolt-zunigaj1101.aws-us-east-1.turso.io",
    authToken: process.env.DB_TOKEN
})

try {
    await db.execute (`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT,
            date DATE,
            user TEXT
        )
    `)
} catch (error) {
    console.log(error.message)
}

app.use(logger('dev'))

// el Socket escucha la conexion de un usuario
io.on('connection', async (socket) => {
    console.log ('a user has connected')

    // escucha la desconexión de un usario
    socket.on('disconnect', () => {
        console.log ('A user disconnected')
    })

    // Escucha los mesaje de los usuarios
    socket.on('chat message', async (msg) => {
        let result
        const date = new Date().toISOString()
        try {
        result = await db.execute ({
                sql: 'INSERT INTO messages (content, date) VALUES (:msg, :date)',
                args: { msg, date}
            }) 
        } catch (error) {
            console.error(error.message)
            return
        }

        io.emit('chat message', msg, date ,result.lastInsertRowid.toString())
    })


    if (!socket.recovered) {
        try {
            const results = await db.execute({
                sql: 'SELECT id, content, date FROM messages WHERE id > ?',
                args:[socket.handshake.auth.serverOffset ?? 0]
            })
            
            results.rows.forEach (row => {
                socket.emit('chat message', row.content, row.date, row.id.toString())
            })
        } catch (error) {
            console.error(error.message)
        }
    }
})

app.get('/',(req, res) => {
    res.sendFile(process.cwd() + "/client/index.html")
})

server.listen (port, () => {
    console.log (`Sever running on port: http://localhost:${port}`)
})