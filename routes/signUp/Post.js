'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../locales');
const authUserCollection = require("../../models/auth");
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
    username: Joi.string().required().description(locals['signUp'].Post.fieldsDescription.username),
    phoneNumber: Joi.string().required().description(locals['signUp'].Post.fieldsDescription.phoneNumber),
    companyName: Joi.string().required().description(locals['signUp'].Post.fieldsDescription.companyName),
    email: Joi.string().required().description(locals['signUp'].Post.fieldsDescription.email),
    GST: Joi.string().description(locals['signUp'].Post.fieldsDescription.GST),
    password: Joi.string().required().description(locals['signUp'].Post.fieldsDescription.password),
    confirmPassword: Joi.string().required().description(locals['signUp'].Post.fieldsDescription.confirmPassword)
}).unknown();

const handler = async(req, res) => {
    try {
        const payload = req.payload
        const checkDuplication = await authUserCollection.SelectById({ $or: [{ phoneNumber: payload.phoneNumber }, { email: payload.email }] }, {});
        console.log(checkDuplication);
        let body={
            username: payload.username,
            phoneNumber: payload.phoneNumber,
            companyName: payload.companyName,
            email: payload.email,
            active: false,
            ban: false,
            role: "user",
            password: bcrypt.hashSync(payload.password, 10),
        }
        if(payload.GST)
        {
            body['GST']=payload.GST
        }
        if (!checkDuplication) {
            const singUp = await authUserCollection.Insert(body);
            const findUser = await authUserCollection.SelectById({ _id: singUp.insertedId }, {});
            if (singUp) {
                return res.response({
                    message: locals["genericErrMsg"]["200"],
                    data: {
                        user: findUser
                    }
                }).code(200);
            } else {
                return res.response({ message: locals["genericErrMsg"]["204"] }).code(204);
            }
        } else {
            return res.response({ message: locals["signUp"]["Post"]["error"]["duplicate"] }).code(500);
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