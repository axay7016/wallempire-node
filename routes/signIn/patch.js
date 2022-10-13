'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../locales');
const authUserCollection = require("../../models/auth");
const middleware = require('../../middleware')
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
/**
 * @description for user signIn
 * @property {string} authorization - authorization
 * @property {string} lang - language
 * @property {string} categoryName - for select specific category details
 * @returns 200 : Success
 * @returns 500 : Internal Server Error
 * 
 * @author Vatsal Sorathiya
 * @date 11-Dec-2020
 */

const validator = Joi.object({
    user_id: Joi.string().required().description(locals['signIn'].Post.fieldsDescription.email),
    active: Joi.boolean().description(locals['signIn'].Post.fieldsDescription.active),
    ban: Joi.boolean().description(locals['signIn'].Post.fieldsDescription.ban)
}).unknown();

const handler = async(req, res) => {
    try {
        const payload = req.payload
        let data = {}
        if (payload.active == false || payload.active == true) {
            data = {
                active: payload.active
            }
        }
        if (payload.ban == false || payload.ban == true) {
            data = {
                ban: payload.ban
            }
        }
        const authResult = await authUserCollection.Update({ _id: ObjectId(payload.user_id) }, data)
        if (authResult) {
            const findUser = await authUserCollection.SelectById({ _id: ObjectId(payload.user_id) }, {});
            return res.response({
                message: locals["genericErrMsg"]["200"],
                data: {
                    user: findUser
                }
            }).code(200);
        } else {
            return res.response({ message: locals["genericErrMsg"]["204"] }).code(204);
        }
    } catch (e) {
        logger.error(e.message)
        return res.response({ message: locals["genericErrMsg"]["500"] }).code(500);
    }
}

const response = {
    status: {
        200: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["200"]), data: Joi.any() }),
        500: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["500"]) }),
        204: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["204"]) }),
    }
}

module.exports = { validator, response, handler }