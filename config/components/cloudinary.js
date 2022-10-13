'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
    CLOUDINARY_NAME: joi.string().required(),
    CLOUDINARY_API_KEY: joi.string().required(),
    CLOUDINARY_SECRET: joi.string().required(),
}).unknown().required()

const { error, value: envVars } = envVarsSchema.validate(process.env)

const config = {
    cloudinary: {
        name: envVars.CLOUDINARY_NAME,
        api_key: envVars.CLOUDINARY_API_KEY,
        secret_key: envVars.CLOUDINARY_SECRET
    }
}

module.exports = config
