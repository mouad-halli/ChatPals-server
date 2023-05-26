import Joi from "joi"

export const validator = (
    validationSchema: Joi.Schema,
    validationOptions: Joi.ValidationOptions
    ) => (payload: any) => {
        return validationSchema.validate(payload, validationOptions)
}