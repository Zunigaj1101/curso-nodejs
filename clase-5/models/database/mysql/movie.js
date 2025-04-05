import mysql from "mysql2/promise";
import dotenv from 'dotenv'

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const DEFAULT_CONFING = {
    host: process.env.LOCAL_DB_HOST,
    user: process.env.LOCAL_DB_USER,
    port: process.env.LOCAL_DB_PORT,
    password: process.env.LOCAL_DB_PASSWORD,
    database: process.env.LOCAL_DB_NAME
};

const connectionString = process.env.DB_URL ?? DEFAULT_CONFING

const connection = await mysql.createConnection(connectionString);

function proccesMovies(movies){
    return movies.map(movie => {
        movie.rate = parseFloat(movie.rate)
        movie.genre = movie.genre.split(',')
        return movie
    })
}

async function addGenresMovies (uuid, genre) {
    for (let value of genre) {
        await connection.query (`
            INSERT INTO movies_genres (movie_id, genre_id) 
            values (UUID_TO_BIN("${uuid}"),
            (SELECT id FROM genre WHERE lower(name) = ?));
            `, [value.toLowerCase()])
    }
}

export class MovieModels {
    static async getAll ({ genre }) {

        if (genre) {
            const [movies] = await connection.query(`
                SELECT BIN_TO_UUID(m.id) as id, m.title, m.year, m.director, m.duration, m.poster, m.rate,
                       GROUP_CONCAT(g.name) as genre
                FROM movie AS m 
                JOIN movies_genres AS mg ON mg.movie_id = m.id 
                JOIN genre AS g ON mg.genre_id = g.id 
                WHERE m.id IN (
                    SELECT mg.movie_id 
                    FROM movies_genres as mg
                    JOIN genre AS g ON mg.genre_id = g.id
                    WHERE LOWER(g.name) = ?
                )
                GROUP BY m.id;`, [genre.toLowerCase()]
            );

            if (movies.length === 0) return { error: {message: "Movies not found"}}
            return proccesMovies(movies)
        }

        const [movies] = await connection.query(`
                SELECT BIN_TO_UUID(m.id) as id, m.title, m.year, m.director, m.duration, m.poster, m.rate,
                       GROUP_CONCAT(g.name) as genre
                FROM movie AS m 
                JOIN movies_genres AS mg ON mg.movie_id = m.id 
                JOIN genre AS g ON mg.genre_id = g.id
                GROUP BY m.id; `
        )

        if (movies.length === 0) return { error: {message: "Movies not found"}}
        return proccesMovies(movies)
    }

    static async getById ({ id }) {
        const [ movies ] = await connection.query (`
                SELECT BIN_TO_UUID(m.id) as id, m.title, m.year, m.director, m.duration, m.poster, m.rate,
                       GROUP_CONCAT(g.name) as genre
                FROM movie AS m 
                JOIN movies_genres AS mg ON mg.movie_id = m.id 
                JOIN genre AS g ON mg.genre_id = g.id
                WHERE m.id = UUID_TO_BIN(?)
                GROUP BY m.id;
        `, [id]);

        if (movies.length === 0) return { error: {message: "Movie not found"}}
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

        try {
            // llamo a la BD para que haga el UUID
            const [  uuidResult ] = await connection.query('SELECT UUID() uuid;')
            const [{ uuid }] = uuidResult
        
            await connection.query (`
                INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES
                (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)
                `, [uuid,title, year, director, duration, poster, rate]
            );
            await addGenresMovies (uuid, genre);

            const [ movie ] = await connection.query (`
                SELECT BIN_TO_UUID(m.id) as id, m.title, m.year, m.director, m.duration, m.poster, m.rate,
                       GROUP_CONCAT(g.name) as genre
                FROM movie AS m 
                JOIN movies_genres AS mg ON mg.movie_id = m.id
                JOIN genre AS g ON mg.genre_id = g.id
                WHERE m.id = UUID_TO_BIN(?)
                GROUP BY m.id;`, [uuid]
            );

            return proccesMovies(movie)
        } catch (error) {
            console.error(error.message, error.sql)
            return {error: {message: 'Movie not created'}}
        }

    }

    static async delete ({ id }) {
        try {
            // elimino los generos asociados
            await connection.query(`DELETE FROM movies_genres WHERE movie_id = UUID_TO_BIN(?);`, [id])

            // se elimina la pelicula
            const [ result ] = await connection.query(`DELETE FROM movie WHERE id = UUID_TO_BIN(?) ;`, [id])

            if (result.affectedRows === 0) return false;
            return true;

        } catch (error) {
            console.error (error.message, error.sql)
            return false;
        }
    }

    static async update ({ id, input }) {
        
    }
}