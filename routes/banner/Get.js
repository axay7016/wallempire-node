'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../locales');
const bannerCollection = require("../../models/banner");

const middleware = "";

/**
 * @description get all or specifice category details
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
    type: Joi.string().description(locals['banner'].Get.fieldsDescription.type)
}).unknown();

const handler = async(req, res) => {
    try {
        var bannerResult = {}

        if(req.query.type) {
            bannerResult = await bannerCollection.Select({
                type: req.query.type
            })
        } else {
            bannerResult = await bannerCollection.Select({})
        }

        if (bannerResult && bannerResult.length) {
            return res.response({
                message: locals["genericErrMsg"]["200"],
                data: bannerResult
            }).code(200);
        } else {
            return res.response({
                message: locals["genericErrMsg"]["204"],
            }).code(204);
        }
    } catch (e) {
        logger.error(e.message)
        return res.response({ message: locals["genericErrMsg"]["500"] }).code(500);
    }
}

const response = {
    status: {
        200: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["200"]), data: Joi.any() }),
        204: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["204"]) }),
        500: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["500"]) }),
    }
}

module.exports = { validator, response, handler }