import { Router } from "express"; 

import { validateMovie, validatePartialMovie } from '../schemes/scheme.js';
import { MovieModels } from "../controllers/movie.js";

export const moviesRouter = Router ()

moviesRouter.get('/', async (req, res) => {
    const { genre } = req.query
    const dataMovies = await MovieModels.getAll ({ genre })
    res.json (dataMovies);
});

moviesRouter.get ('/:id', async (req, res) => { //path-to-regexp
    const { id } = req.params
    const movie = await MovieModels.getById ({ id })
    if (movie) return res.json(movie)
    res.status(404).json({'message': 'Movie not found'})
});

moviesRouter.post('/', async (req, res) => {
    const result = validateMovie(req.body)
    if (result.error) {
        // 422 Unprocessable Entity
        return res.status(400).json ({error: JSON.parse(result.error.message)})
    }
    const newMovie = await MovieModels.create ({ input: result.data })
    res.status(201).json(newMovie) // actualizar la cache del cliente
});

moviesRouter.delete ('/:id', (req, res) => {
    const { id } = req.params
    const result = MovieModels.delete ({ id })
    if (result === false) {
        return res.status (404). json({message: 'Moive not found'});
    }
    return res.json({ message: 'Movie deleted' });
})

moviesRouter.patch('/:id', async (req, res) => {
    const { id } = req.params
    const movieIndex = await MovieModels.update({ id })
    if (movieIndex === null) {
        return res.status(400).json({message: 'Movie no found'})
    }

    const result = validatePartialMovie(req.body);

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const updateMovie = await MovieModels.update({ input: result, index: movieIndex})
    return res.json(updateMovie);
})