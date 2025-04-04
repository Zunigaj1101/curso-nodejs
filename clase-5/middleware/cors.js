import cors from 'cors';

const ACCEPTED_ORIGINS = [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://localhost:1234',
    'http://localhost:8080'
]

export const corsMiddleware = ( { acceptedOrigins = ACCEPTED_ORIGINS} = {}) => cors({
    origin: (origin, next) => {
        if (acceptedOrigins.includes(origin)) {
            return next(null, true)
        }

        if (!origin){
            return next(null, true)
        }
        return next (new Error ('Not allowed by CORS'))
    }
})