import { validateMovie, validatePartialMovie } from "../schemes/scheme.js"

export class MovieController {
    constructor ({movieModels}) {
        this.movieModels = movieModels
    }

    getAll = async (req, res) => {
        const { genre } = req.query;
        const dataMovies = await this.movieModels.getAll ({ genre });
        if (dataMovies.error) return res.status(404).json (dataMovies.error);
        res.status(200).json(dataMovies);
    }

    getById = async (req, res) => {
        const { id } = req.params
        const dataMovies = await this.movieModels.getById ({ id });
        if (dataMovies.error) return res.status(404).json (dataMovies.error);
        res.status(200).json(dataMovies);
    }

    create = async (req, res) => {
        // validacion de la request
        const result = validateMovie(req.body)
        if (result.error) return res.status(400).json ({error: JSON.parse(result.error.message)})
        
        // creacion de la movie
        const newMovie = await this.movieModels.create ({ input: result.data })
        if (newMovie.error) return res.status(500).json(newMovie.error);
        res.status(201).json(newMovie);
    }

    delete = async (req, res) => {
        const { id } = req.params
        const result = await this.movieModels.delete ({ id })

        if (result === false) return res.status (404). json({message: 'Movie not found'});
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