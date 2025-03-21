const http = require ('node:http');
const dittoJSON = require('./pokemon/ditto.json');
const { json } = require('node:stream/consumers');
const desiredPort = 1234;

const processResquest = (req, res) => {
    const { method, url } = req;

    switch (method) {
        case 'GET':
            switch (url) {
                case '/pokemon/ditto': 
                    res.setHeader('Content-Type', 'application/json; charset=utf-8');
                    return res.end (JSON.stringify(dittoJSON));
                default:
                    res.statusCode = 404;
                    res.setHeader ('Content-Type', 'text/html; charset=utf-8');
                    return res.end ('<h1>404</h1>');
            };
        case 'POST':
            switch (url) {
                case '/pokemon':{ 
                    let body = ''

                    // Escucha el evento data
                    req.on('data', chunk => {
                        body += chunk.toString()
                    })
                    // Escucha que si la request ha terminado
                    req.on ('end', () => {
                        const data = JSON.parse(body)
                        // escribo los Heads
                        res.writeHead(201, {'Content-Type': 'application/json; charset=utf-8'})
                        // le agrego el tiempo para ver que si esta hacinedo algo
                        data.timestap = Date.now()
                        // devuelvo el JSON para ver que hizo
                        res.end(JSON.stringify(data))
                    })
                break;
                }
                default:
                    res.statusCode = 404;
                    res.setHeader ('Content-Type', 'text/html; charset=utf-8');
                    return res.end ('<h1>404</h1>');
            };
    }
};

const server = http.createServer (processResquest);

server.listen (desiredPort, () => {
    const port = server.address().port
    console.log (`server listening http://localhost:${port}`)
}); 