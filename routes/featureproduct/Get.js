'use strict'

const { ObjectID } = require('bson');
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
    category_id: Joi.string().description(locals['featureProduct'].Get.fieldsDescription.category_id)
}).unknown();

const handler = async (req, res) => {
    try {
        let condition = {
            type: 'category'
        }
        if(req.query.category_id){
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
        let data = [],index=0;

       categoryResult.forEach( async (item)=>{
           item.featuredProducts.forEach(async (featureItem)=>{
          
               data[index] = {
                _id: featureItem._id,
                postName: featureItem.postName,
                description: featureItem.description,
                postImage1: featureItem.postImage1,
                postImage2: featureItem.postImage2,
                postImage3: featureItem.postImage3,
                postImage4: featureItem.postImage4,
                productStatus: featureItem.productStatus,
                price: featureItem.price,
                category_id: featureItem.category_id,
                categoryName:item.name,
                sub_category_id: featureItem.sub_category_id
                   }
               index++ 
            })
        })

        if (categoryResult && categoryResult.length) {
            return res.response({
                message: locals["genericErrMsg"]["200"],
                data: data 
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

module.exports = { validator,response, handler }