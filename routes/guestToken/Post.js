'use strict'
const Joi = require('joi');
const ObjectID = require('mongodb').ObjectID;
const locals = require('../../locales');
var jwtValidator = require('../../middleware/auth');
const config = require("../../config")

const validator = Joi.object({
    IpAddress: Joi.string().required().description('IpAddress is required')
}).unknown();

const handler = async (req, res) => {
    const guestToken = await jwtValidator.generateTokens(
        {
            userId: '' + new ObjectID(),
            userType: 'guest',
            metaData: {
                IpAddress: req.payload.IpAddress
            },
            accessTTL: config.auth.expireTime
        })
    return res.response({ message: locals['genericErrMsg']['200'], token: guestToken }).code(200)
}

const response = {
    status: {
        200: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["200"]), token: Joi.any() }),
        500: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["500"]) }),
    }
}

module.exports = { validator, handler, response }
