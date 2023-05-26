import Joi from "joi"
import { validator } from "./validator"

const updateUserSchema = Joi.object({
    firstname: Joi.string(),
    lastname: Joi.string(),
    email: Joi.string(),
    password: Joi.string().min(3).max(12).alphanum(),
})

export const validateUpdateUser = validator(updateUserSchema, { abortEarly: true })