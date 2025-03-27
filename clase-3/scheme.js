const z = require('zod');

const moviesSchema = z.object ({
    title: z.string({ 
        invalid_type_error: 'Movie title must be string.',
    required_error: 'Movie title is required.'
}),
year: z.number().int().min(1900).max(2024),
director: z.string(),
duration: z.number().int().positive(),
rate: z.number().min(0).max(10).optional(),
poster: z.string().url({
    message: 'Poster must be a valid URL.'
}),
genre: z.array(z.enum([
    'Action', 'Sci-fi', 'Terror', 'Comedy', 'Drama', 'Romance', 
    'Documentary', 'Animation', 'Fantasy', 'Adventure', 'Thriller', 
    'Mystery', 'Crime', 'Family', 'Music', 'War', 'History', 
    'Western', 'Biography', 'Sport', 'Musical', 'Short', 'News', 
    'Reality-TV', 'Talk-Show'
]))
});

function validateMovie (object) {
    return moviesSchema.safeParse(object);
}

function validatePartialMovie (object) {
    return moviesSchema.partial().safeParse(object);
}

module.exports = {
    validateMovie,
    validatePartialMovie
}