import { validateMovie, validatePartialMovie } from "../schemes/scheme.js"

export class MovieController {
    constructor ({movieModels}) {
        this.movieModels = movieModels
    }

    getAll = async (req, res) => {
        const { genre } = req.query;
        const dataMovies = await this.movieModels.getAll ({ genre });
        if (dataMovies) return res.json (dataMovies);
        res.status (404).json ({'message': 'Movies not found'})
    }

    getById = async (req, res) => {
        const { id } = req.params
        const movie = await this.movieModels.getById ({ id })
        if (movie) return res.json(movie)
        res.status(404).json({'message': 'Movie not found'})
    }

    create = async (req, res) => {
        const result = validateMovie(req.body)
        if (result.error) {
            // 422 Unprocessable Entity
            return res.status(400).json ({error: JSON.parse(result.error.message)})
        }
        const newMovie = await this.movieModels.create ({ input: result.data })
        if (!newMovie || Object.keys(newMovie).length === 0) {
            return res.status(500).json({ message: "Movie not created" });
        }
        res.status(201).json(newMovie) // actualizar la cache del cliente
    }

    delete = async (req, res) => {
        const { id } = req.params
        const result = this.movieModels.delete ({ id })
        if (result === false) {
            return res.status (404). json({message: 'Moive not found'});
        }
        return res.json({ message: 'Movie deleted' });
    }

    update = async (req, res) => {
        const result = validatePartialMovie(req.body);
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        
        const { id } = req.params
        const updatedMovie = await this.movieModels.update({ id, input: result.data})
    
        return res.json(updatedMovie);
    }
};