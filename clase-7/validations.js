import zod from "zod";

const validations = zod.object({
    username: zod.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
    password: zod.string().min(6, "La contraseña debe tener al menos 6 caracteres")    
}); 

export function userValidation (object) {
    return validations.safeParse(object)
};