import express, { json } from 'express';
import { moviesRouter } from './routes/movies.js';
import { corsMiddleware } from './middleware/cors.js';

const app = express();
app.use (json())
app.disable ('x-powered-by');
app.use (corsMiddleware());

app.use((req, res, next) => {
    console.log('Origin:', req.headers.origin);
    next();
});

app.use('/movies', moviesRouter)

const port = process.env.PORT ?? 1234

app.listen (port, () => {
    console.log (`server listening http://localhost:${port}`)
})