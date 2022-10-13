'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../locales');
const authUserCollection = require("../../models/auth");
const middleware = require('../../middleware')
const bcrypt = require('bcryptjs');
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
    email: Joi.string().required().description(locals['signIn'].Post.fieldsDescription.email),
    password: Joi.string().min(8).description(locals['signIn'].Post.fieldsDescription.password)
}).unknown();

const handler = async(req, res) => {
    try {
        const authResult = await authUserCollection.SelectOne({
            "email": req.payload.email
        })
        if (!bcrypt.compareSync(req.payload.password, authResult.password)) {
            return res.response({ message: locals["signIn"]["Post"]["error"]["login"] }).code(500);
        }

        if (authResult.role == 'user' && authResult.active == false) {
            return res.response({ message: locals["signIn"]["Post"]["error"]["active"] }).code(500);
        }
        if (authResult.ban == true) {
            return res.response({ message: locals["signIn"]["Post"]["error"]["ban"] }).code(500);
        }
        if (authResult) {
            let token
            if(authResult.role == "admin"){
                console.log('admin')
                token = await middleware.auth.generateTokens({
                    userId: "" + authResult._id,
                    userType: authResult.role,
                    metaData: authResult
                })
            }else{
                console.log('user')
                token = await middleware.auth.generateTokens({
                    userId: "" + authResult._id,
                    userType: authResult.role,
                    metaData: authResult
                })
            }
            return res.response({
                message: locals["genericErrMsg"]["200"],
                data: {
                    user: authResult,
                    access_token: token
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