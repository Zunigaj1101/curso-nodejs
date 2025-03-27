const express = require ('express')
const dataMovies = require('./movies.json') 
const crypto = require('node:crypto');
const  { validateMovie, validatePartialMovie } = require ('./scheme.js')
const cors = require ('cors')
const app = express();

app.disable ('x-powered-by');
app.use (cors({
    origin: (origin, next) => {
        const ACCEPTED_ORIGINS = [
            'http://127.0.0.1:5500',
            'http://localhost:5500',
            'http://localhost:1234',
            'http://localhost:8080'
        ]
        if (ACCEPTED_ORIGINS.includes(origin)) {
            return next(null, true)
        }

        if (!origin){
            return next(null, true)
        }
        return next (new Error ('Not allowed by CORS'))
    }

}))

app.use((req, res, next) => {
    console.log('Origin:', req.headers.origin);
    next();
});

// Middleware para modifcar el req.body
app.use (express.json())


// Todos los recursos que sean MOVIES se identifican con /movies
app.get('/movies',(req, res) => {
    const { genre, search } = req.query
    if (genre) {
        const movieFilter = dataMovies.filter(
        movie => movie.genre.some(movie => movie.toLowerCase() === genre.toLowerCase())
        )
        return res.json (movieFilter)
    }
    res.json (dataMovies)
});

app.get ('/movies/:id', (req, res) => { //path-to-regexp
    const { id } = req.params
    const movie = dataMovies.find(movie => movie.id === id)
    if (movie) return res.json(movie)
    res.status(404).json({'message': 'Movie not found'})
});

app.post('/movies', (req, res) => {
    const result = validateMovie(req.body)

    if (result.error) {
        // 422 Unprocessable Entity
        return res.status(400).json ({error: JSON.parse(result.error.message)})
    }

    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    }

    // Esto no sería REST, porque estamos guardando
    // el estado de la aplicación en memoria
    dataMovies.push(newMovie)

    res.status(201).json(newMovie) // actualizar la cache del cliente
})

app.delete ('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = dataMovies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
        return res.status (404). json({message: 'Moive not found'})
    }

    dataMovies.splice(movieIndex, 1)
    return res.json({ message: 'Movie deleted' })
})

app.patch('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = dataMovies.findIndex(movie => movie.id === id)
    if (movieIndex < 0) {
        return res.status(400).json({message: 'Movie no found'})
    }

    const result = validatePartialMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
  
    const updateMovie = {
      ...dataMovies[movieIndex],
      ...result.data
    }

    dataMovies[movieIndex] = updateMovie

    return res.json(updateMovie)
})
const port = process.env.PORT ?? 1234

app.listen (port, () => {
    console.log (`server listening http://localhost:${port}`)
})