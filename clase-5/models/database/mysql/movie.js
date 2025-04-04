import mysql from "mysql2/promise";
import { validateMovie } from "../../../schemes/scheme.js";
import dotenv from 'dotenv'

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const DEFAULT_CONFING = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const connectionString = process.env.DB_URL ?? DEFAULT_CONFING

const connection = await mysql.createConnection(connectionString);

function proccesMovies(movies){
    return movies.map(movie => {
        movie.rate = parseFloat(movie.rate)
        movie.genre = movie.genres.split(',')
        const orMovie = validateMovie (movie)
        const result = (orMovie.success) ? orMovie.data : orMovie.error
        return result
    })
} 

export class MovieModels {
    static async getAll ({ genre }) {

        if (genre) {
            const lowerCaseGenre = genre.toLowerCase()

            let [movies] = await connection.query(`
                SELECT BIN_TO_UUID(m.id) as id, m.title, m.year, m.director, m.duration, m.poster, m.rate,
                       GROUP_CONCAT(g.name) as genres
                FROM movie AS m 
                JOIN movies_genres AS mg ON mg.movie_id = m.id 
                JOIN genre AS g ON mg.genre_id = g.id 
                WHERE m.id IN (
                    SELECT mg.movie_id 
                    FROM movies_genres as mg
                    JOIN genre AS g ON mg.genre_id = g.id
                    WHERE LOWER(g.name) = ?
                )
                GROUP BY m.id;`, [lowerCaseGenre]
            );
                
            if (movies.length === 0) return null
            return proccesMovies(movies)
        }

        const [movies] = await connection.query(`
                SELECT BIN_TO_UUID(m.id) as id, m.title, m.year, m.director, m.duration, m.poster, m.rate,
                       GROUP_CONCAT(g.name) as genres
                FROM movie AS m 
                JOIN movies_genres AS mg ON mg.movie_id = m.id 
                JOIN genre AS g ON mg.genre_id = g.id
                GROUP BY m.id; `
        )

        if (movies.length === 0) return null
        return proccesMovies(movies)
    }

    static async getById ({ id }) {
        const [ movies ] = await connection.query (`
                SELECT BIN_TO_UUID(m.id) as id, m.title, m.year, m.director, m.duration, m.poster, m.rate,
                       GROUP_CONCAT(g.name) as genres
                FROM movie AS m 
                JOIN movies_genres AS mg ON mg.movie_id = m.id 
                JOIN genre AS g ON mg.genre_id = g.id
                WHERE m.id = UUID_TO_BIN(?)
                GROUP BY m.id;
        `, [id]);

        if (movies.length === 0) return null

        return proccesMovies (movies)
    }

    static async create ({ input }) {

        // Destructuro el input para obtener los valores
        const {
            title,
            year,
            director,
            duration,
            poster,
            genre,
            rate
        } = input

        // llamo a la BD para que haga el UUID
        const [  uuidResult ] = await connection.query('SELECT UUID() uuid;')
        const [{ uuid }] = uuidResult
        
        try {
            const result = await connection.query (`
            INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES
            (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?)
            `, [title, year, director, duration, poster, rate])
        } catch (error) {
            console.log (error.message)
        }
    
        const [ movie ]  = await connection.query (`
        SELECT  BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate
        FROM movie WHERE id = UUID_TO_BIN(?); 
        `, [uuid])

        return movie
    }

    static async delete ({ id }) {
    
    }

    static async update ({ id, input }) {
        
    }
}