'use strict'

const { ObjectID, ObjectId } = require('bson');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../locales');
const enquiryCollection = require("../../models/enquiry");

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
    user_id: Joi.string().description(locals['enquiry'].Get.fieldsDescription.user_id),
    page: Joi.number().description(locals['user'].Get.fieldsDescription.page),
    limit: Joi.number().description(locals['user'].Get.fieldsDescription.limit)
}).unknown();

const handler = async(req, res) => {
    try {
        let enquiryResult;
        let page = req.query.page ? req.query.page : 0;
        let limit = req.query.limit ? req.query.limit : 20;
        let condition =[];

        if (req.query.user_id) {
            condition.push({
                $match: {
                    user_id: ObjectId(req.query.user_id)
                }
            })
            
        }
        condition.push({ $sort: { _id: -1 } }, { $skip: page * limit }, { $limit: limit });
        console.log(condition);
        enquiryResult = await enquiryCollection.Aggregate(condition)
        return res.response({
            message: locals["genericErrMsg"]["200"],
            data: {
                enquiry: enquiryResult
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