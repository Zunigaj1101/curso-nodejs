import { createRequire } from "module";
import { randomUUID } from 'node:crypto';

const require = createRequire (import.meta.url)
const dataMovies = require ("../movies.json")

export class MovieModels {
    static async getAll ({ genre }) {
        if (genre) {
            const movieFilter = dataMovies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
            )
            return movieFilter;
        }
        return dataMovies;
    }

    static async getById ({ id }) {
        const movie = dataMovies.find(movie => movie.id === id)
        return movie;
    }
    
    static async create ({ input }) {
        const newMovie = {
        id: randomUUID(),
            ...input
        }
    
        // Esto no sería REST, porque estamos guardando
        // el estado de la aplicación en memoria
        dataMovies.push(newMovie)
        return newMovie
    }

    static async delete ({ id }) {
        const movieIndex = dataMovies.findIndex(movie => movie.id === id)
        
        if (movieIndex === -1) return false;

        dataMovies.splice(movieIndex, 1)
        return true;
    }

    static async update ({ id, input, index}) {
        if (id) {
            const movieIndex = dataMovies.findIndex (movie => movie.id === id)
            if (movieIndex < 0) return null;
            return movieIndex;
        }

        const updateMovie = {
            ...dataMovies[index], /// pelicula actual 
            ...input.data // datos a actualizar
        }

        dataMovies[index] = updateMovie
        return updateMovie;
    }
}