'use strict'

const { ObjectID } = require('bson');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../locales');
const categoryCollection = require("../../models/categories");

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
    subCatgory_id: Joi.string().min(24).description(locals['sub-category'].Get.fieldsDescription.subCatgory_id)
}).unknown();

const handler = async(req, res) => {
    try {
        const query = req.query
        let categoryResult
        if (req.query.subCatgory_id) {
         categoryResult = await categoryCollection.Select({
            type: "sub-category",_id:ObjectID(query.subCatgory_id)
        })}
        else{
             categoryResult = await categoryCollection.Select({
                type: "sub-category"
            })
        }
        return res.response({
            message: locals["genericErrMsg"]["200"],
            data: {
                category: categoryResult
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

module.exports = { validator,response, handler }