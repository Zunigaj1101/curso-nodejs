import express, { json } from 'express';
import { createRoutes } from './routes/movies.js';
import { corsMiddleware } from './middleware/cors.js';

export const createApp = ({ movieModels }) => {
    const app = express();
    app.use (json())
    app.disable ('x-powered-by');
    app.use (corsMiddleware());
    
    app.use((req, res, next) => {
        console.log('Origin:', req.headers.origin);
        next();
    });
    
    app.use('/movies', createRoutes({ movieModels }))
    
    const port = process.env.PORT ?? 1234
    
    app.listen (port, () => {
        console.log (`server listening http://localhost:${port}`)
    })
}

