import DBlocal from "db-local";
import { userValidation } from "./validations.js";
import { randomUUID } from 'node:crypto'
import {compare, hash} from 'bcrypt';
import { SALT_ROUNDS } from "./config.js";

const { Schema } = new DBlocal ({ path: "./db"});

const User = Schema ("User", {
    _id: { type: String, required: true},
    username: { type: String, required: true },
    password: { type: String, required: true }
})

export class UserRepository {
    static async create ({username, password}) {
        // validacion de datos
        const result = userValidation ({username, password})
        if (result.error) throw new Error(result.error)

        // Verifcacion de que el usario no exista
        const user = User.findOne({ username })
        if (user) throw new Error ("username already exists")

        const id = randomUUID()
        const hashedPassword = await hash(password, SALT_ROUNDS)

        User.create({
            _id: id,
            username,
            password: hashedPassword
        }).save()

        return id
    }
    static async login ({username, password}) {
        // Verificacion de los datos
        const result = userValidation ({ username, password })
        if (result.error) throw new Error(result.error)

        // Verifcacion de que el usario exista
        const user = User.findOne({ username })
        if (!user) throw new Error ("Username not exists")

        const isValid = await compare(password, user.password)
        if (!isValid) throw new Error ("Password is invalid")
        
        return user
    }
}
