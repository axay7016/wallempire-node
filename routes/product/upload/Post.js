'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../../locales');
const { ObjectId } = require('mongodb');
const { uploadImage } = require('../../../library/cloudinary');
/**
 * @description post a new post
 * @property {string} authorization - authorization
 * @property {string} lang - language
 * @property {string} postName - for select specific post details
 * @returns 200 : Success
 * @returns 500 : Internal Server Error
 * 
 * @author Vatsal Sorathiya
 * @date 11-Dec-2020
 */

const validator = Joi.object({
    postImage1: Joi.any().meta({ swaggerType: 'file' }).required().description(locals['product'].Post.fieldsDescription.postImage),
}).unknown();

const handler = async(req, res) => {
    try {
        const payload = req.payload
        const response1 = await uploadImage(payload.postImage1, 'product')
        if (response1) {
        return res.response({
            message: locals["genericErrMsg"]["200"],
            data: response1
        }).code(200);
        } else {
            console.log('test2')
            return res.response({ message: locals["genericErrMsg"]["204"] }).code(409);
        }
    } catch (e) {
        console.log('test3')
        logger.error(e.message)
        return res.response({ message: locals["genericErrMsg"]["500"] }).code(500);
    }
}

const response = {
    status: {
        200: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["200"]), data: Joi.any() }),
        500: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["500"]) }),
    }
}

module.exports = { validator, response, handler }