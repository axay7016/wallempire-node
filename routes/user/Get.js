'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../locales');
const userCollection = require("../../models/user");
const { ObjectId } = require('mongodb');

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
    user_id: Joi.string().description(locals['user'].Get.fieldsDescription.user_id),
    page: Joi.number().description(locals['user'].Get.fieldsDescription.page),
    limit: Joi.number().description(locals['user'].Get.fieldsDescription.limit)
}).unknown();

const handler = async (req, res) => {
    try {
        let userResult, userCount;
        let page = req.query.page;
        let limit = req.query.limit ? req.query.limit : 20;

        let condition = {}
        if (req.query.user_id) {
            condition = { _id: ObjectId(req.query.user_id), role: "user" }
        } else {
            condition = { role: "user" }
        }

        userResult = await userCollection.SelectWithSort(condition, {}, {}, page * limit, limit)
        userCount = await userCollection.Select(condition)

        return res.response({
            message: locals["genericErrMsg"]["200"],
            data: {
                user: userResult,
                currentPage: req.query.page,
                page: Math.ceil(userCount.length / limit)
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
