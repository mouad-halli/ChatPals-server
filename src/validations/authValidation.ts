import Joi from 'joi'
import { validator } from './validator'

const registerSchema = Joi.object({  
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(12).alphanum().required(),
    passwordConfirmation: Joi.ref('password')
})

const LoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().required(),
})

export const validateRegister = validator(registerSchema, { abortEarly: true })

export const validateLogin = validator(LoginSchema, { abortEarly: true })