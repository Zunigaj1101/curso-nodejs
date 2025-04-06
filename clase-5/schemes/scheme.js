import mysql from "mysql2/promise";
import z from 'zod';
import dotenv from 'dotenv';

dotenv.config()

const DEFAULT_CONFING = {
    host: process.env.LOCAL_DB_HOST,
    user: process.env.LOCAL_DB_USER,
    port: process.env.LOCAL_DB_PORT,
    password: process.env.LOCAL_DB_PASSWORD,
    database: process.env.LOCAL_DB_NAME
};
const connection = await mysql.createConnection(DEFAULT_CONFING)

const getGenres = async () => {
    const [ genres ] = await connection.query(`
        SELECT name FROM genre;    
    `)
    const result = genres.map( genre => { return genre.name})
    return result
}

const curretGenres = await getGenres() 

const moviesSchema = z.object ({
    id: z.string().uuid().optional(),
    title: z.string({ 
        invalid_type_error: 'Movie title must be string.',
    required_error: 'Movie title is required.'
}),
year: z.number().int().min(1900).max(2025),
director: z.string(),
duration: z.number().int().positive(),
rate: z.number().min(0).max(10).optional(),
poster: z.string().url({
    message: 'Poster must be a valid URL.'
}),
genre: z.array(z.enum(curretGenres)).min(1, { message: 'At least one genre is required.' })
});

export function validateMovie (object) {
    return moviesSchema.safeParse(object);
}

export function validatePartialMovie (object) {
    return moviesSchema.partial().safeParse(object);
}