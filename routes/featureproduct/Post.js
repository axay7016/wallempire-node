'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const categoryCollection = require("../../models/categories");
const postCollection = require("../../models/product");
const logger = require('winston');
const locals = require('../../locales');
const { ObjectId } = require('mongodb');
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
    product_id: Joi.string().required().description(locals['featureProduct'].Post.fieldsDescription.product_id),
    category_id: Joi.string().required().description(locals['featureProduct'].Post.fieldsDescription.category_id),
}).unknown();

const handler = async(req, res) => {
    try {
        const payload = req.payload

        const categoryResult = await categoryCollection.SelectOne({
            _id: ObjectId(payload.category_id)
        })
        const postResult = await postCollection.Select({ _id: ObjectId(payload.product_id) })
        if(!postResult){
            return res.response({ message: locals["featureProduct"]["Post"]["error"]["product"] }).code(409);
        }
        if(!categoryResult){
            return res.response({ message: locals["featureProduct"]["Post"]["error"]["category"] }).code(409);
        }


            const checkFeatureProductResult = await categoryCollection.SelectOne({
                featuredProducts: ObjectId(payload.product_id),
            })
           if(checkFeatureProductResult){
            return res.response({ message: locals["featureProduct"]["Post"]["error"]["duplicate"] }).code(409);
           }

           const categoryUpdate =  await categoryCollection.UpdateSection({
            _id: ObjectId(payload.category_id)
        }, {
            featuredProducts: ObjectId(payload.product_id)
        })

        const featureProductResult = await categoryCollection.SelectById({ _id: ObjectId(payload.category_id) }, {})
        
        if (featureProductResult) {
            return res.response({
                message: locals["genericErrMsg"]["200"],
                data: featureProductResult
            })
        } else {
            return res.response({ message: locals["featureProduct"]["Post"]["error"]["process"] }).code(409);
        }
       
    } catch (e) {
        logger.error(e.message)
        return res.response({ message: locals["genericErrMsg"]["500"] }).code(500);
    }
}

const response = {
    status: {
        200: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["200"]), data: Joi.any() }),
        409: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["409"]) }),
        500: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["500"]) }),
    }
}

module.exports = { validator, response, handler }