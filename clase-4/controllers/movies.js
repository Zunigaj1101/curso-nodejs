import { MovieModels } from "../models/movie.js";
import { validateMovie, validatePartialMovie } from "../schemes/scheme.js"

export class MovieController {
    static async getAll (req, res) {
        const { genre } = req.query;
        const dataMovies = await MovieModels.getAll ({ genre });
        // que es lo que renderiza
        res.json (dataMovies);
    }

    static async getById (req, res) {
        const { id } = req.params
        const movie = await MovieModels.getById ({ id })
        if (movie) return res.json(movie)
        res.status(404).json({'message': 'Movie not found'})
    }

    static async create (req, res) {
        const result = validateMovie(req.body)
        if (result.error) {
            // 422 Unprocessable Entity
            return res.status(400).json ({error: JSON.parse(result.error.message)})
        }
        const newMovie = await MovieModels.create ({ input: result.data })
        res.status(201).json(newMovie) // actualizar la cache del cliente
    }

    static async delete (req, res) {
        const { id } = req.params
        const result = MovieModels.delete ({ id })
        if (result === false) {
            return res.status (404). json({message: 'Moive not found'});
        }
        return res.json({ message: 'Movie deleted' });
    }

    static async update (req, res) {
        const result = validatePartialMovie(req.body);
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        
        const { id } = req.params
        const updatedMovie = await MovieModels.update({ id, input: result.data})
    
        return res.json(updatedMovie);
    }
};