import { createApp } from "../app.js";
import { MovieModels } from "../models/database/mysql/movie.js";

createApp ({movieModels: MovieModels})