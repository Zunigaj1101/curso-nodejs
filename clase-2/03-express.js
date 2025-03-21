const express = require ('express')
const ditto = require('./pokemon/ditto.json')
app = express ()
app.disable('x-powered-by');

const PORT = process.env.PORT ?? 1234;

app.use(express.json())

// // middleware
// app.use ((req, res, next) => {
//     if (req.method !== 'POST') return next()
//     if (req.headers['content-type'] !== 'application/json') return next()
//     // solo llegan las request que son POST y tiene el header: Content-Type: application/json
//     let body = ''
//     req.on ('data', chunk => {
//         body += chunk.toString()
//     })
//     req.on ('end', () => {
//         const data = JSON.parse(body)
//         req.body = data
//         next();
//     })
// })

app.get ('/', (req, res) => {
    res.end("<h1>Página principal</h1>")
})

app.get ('/pokemon/ditto', (req, res) => {
    res.json(ditto);
})

app.post('/pokemon', (req, res) => {
    req.body.timestap = Date.now()
    res.status(201).json(req.body)
})

app.use ((req, res) => {
    res.end ('<h1>404</h1>')
})

app.listen (PORT, () => {
    console.log (`server listening http://localhost:${PORT}`)
})