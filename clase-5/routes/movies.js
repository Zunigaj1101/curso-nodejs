import { Router } from "express"; 
import { MovieController } from "../controllers/movies.js";

export const createRoutes = ({ movieModels }) => {
    const moviesRouter = Router ()

    // Creo la instancia del controlador
    const movieController = new MovieController ( {movieModels} );

    moviesRouter.get('/', movieController.getAll);
    moviesRouter.post('/', movieController.create);
    moviesRouter.get ('/:id', movieController.getById);
    moviesRouter.delete ('/:id', movieController.delete);
    moviesRouter.patch('/:id', movieController.update);

    return moviesRouter
}
