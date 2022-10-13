'use strict'

const Joi = require('joi');
const { ObjectId } = require('mongodb');
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
    categoryName: Joi.string().description(locals['category'].Get.fieldsDescription.categoryName),
    category_id: Joi.string().description(locals['category'].Get.fieldsDescription.categoryName)
}).unknown();

const handler = async (req, res) => {
    try {
        let condition = {
            type: 'category'
        }
        if(req.query.category_id){
            console.log(req.query.category_id)
            condition = {
                type: 'category',
                _id:ObjectId(req.query.category_id)
            }
        }
        const categoryResult = JSON.parse(JSON.stringify(await categoryCollection.Aggregate([{
            $match: condition,
        }, {
            $lookup: {
                from: 'category',
                localField: 'section',
                foreignField: '_id',
                as: 'section',
            },
        }
            , {
            $lookup: {
                from: 'product',
                localField: 'featuredProducts',
                foreignField: '_id',
                as: 'featuredProducts',
            },
        }])))
        categoryResult.sort((a, b) => a.section.length > b.section.length?-1:1);
        for (let i = 0; i < categoryResult.length; i++) {
            for (let j = 0; j < categoryResult[i].section.length; j++) {
                const findItem = await categoryCollection.Select({ _id: { $in: categoryResult[i].section[j].items.map(item => ObjectId(item)) } })
                categoryResult[i].section[j]["items"] = findItem
            }
        }
       
        //console.log(categoryResult,"---------------------------------------------------------------------------------------------");
        if (categoryResult && categoryResult.length) {
            return res.response({
                message: locals["genericErrMsg"]["200"],
                data: categoryResult
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

module.exports = { response, handler }