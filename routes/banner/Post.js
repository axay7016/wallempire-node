'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const bannerCollection = require("../../models/banner");
const logger = require('winston');
const locals = require('../../locales');
const { uploadImage } = require('../../library/cloudinary');
/**
 * @description post a new category
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
    bannerImage: Joi.any().required().meta({ swaggerType: 'file' }).description(locals['banner'].Post.fieldsDescription.bannerImage),
    type: Joi.string().required().description(locals['banner'].Post.fieldsDescription.type),
}).unknown();

const handler = async(req, res) => {
    try {
        const payload = req.payload
        const cloudinaryImage = await uploadImage(payload.bannerImage, 'banner')

        const bannerResult = await bannerCollection.Insert({
            image: cloudinaryImage,
            type: payload.type,
        });

        const findbanner = await bannerCollection.SelectById({ _id: bannerResult.insertedId }, {})
        if (bannerResult) {
            return res.response({
                message: locals["genericErrMsg"]["200"],
                data: {
                    banner: findbanner
                }
            }).code(200);
        } else {
            return res.response({ message: locals["genericErrMsg"]["204"] }).code(409);
        }
    } catch (e) {
        logger.error(e.message)
        return res.response({ message: locals["genericErrMsg"]["500"] }).code(500);
    }
}

const response = {
    status: {
        200: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["200"]), data: Joi.any() }),
        409: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["204"]) }),
        500: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["500"]) }),
    }
}

module.exports = { validator, response, handler }