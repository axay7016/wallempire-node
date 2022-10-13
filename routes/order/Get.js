'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../locales');
const orderCollection = require("../../models/order");

const middleware = "";

/**
 * @description get all or specifice order details
 * @property {string} authorization - authorization
 * @property {string} lang - language
 * @property {string} orderName - for select specific order details
 * @returns 200 : Success
 * @returns 500 : Internal Server Error
 * 
 * @author Vatsal Sorathiya
 * @date 11-Dec-2020
 */

const validator = Joi.object({
    user_id: Joi.string().description(locals['order'].Get.fieldsDescription.user_id)
}).unknown();

const handler = async(req, res) => {
    try {
        let orderResult;
        if (req.query.category_id) {
            orderResult = await orderCollection.Select({ user_id: req.query.user_id })
        } else {
            orderResult = await orderCollection.Select({})
        }
        return res.response({
            message: locals["genericErrMsg"]["200"],
            data: {
                order: orderResult
            }
        }).code(200);
    } catch (e) {
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