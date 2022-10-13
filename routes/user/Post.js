'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const orderCollection = require("../../models/order");
const logger = require('winston');
const locals = require('../../locales');
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');
const postCollection = require("../../models/product");
/**
 * @description post a new order
 * @property {string} authorization - authorization
 * @property {string} lang - language
 * @returns 200 : Success
 * @returns 500 : Internal Server Error
 * 
 * @author Vatsal Sorathiya
 * @date 11-Dec-2020
 */

const validator = Joi.object({
    height: Joi.number().required().description(locals['order'].Post.fieldsDescription.height),
    width: Joi.number().required().description(locals['order'].Post.fieldsDescription.width),
    color: Joi.string().required().description(locals['order'].Post.fieldsDescription.color),
    product_id: Joi.string().min(24).required().description(locals['order'].Post.fieldsDescription.product_id),
    status: Joi.string().valid('accept', 'cancle','completed').required().description(locals['order'].Post.fieldsDescription.status),
}).unknown();

const handler = async (req, res) => {
    try {
        let authorization = req.headers.authorization.split(' ')[1]
        let user = jwt.decode(authorization)
        const payload = req.payload
        const postResult = await postCollection.SelectById({ _id: ObjectId(payload.product_id) },{})
        if(!postResult){
            return res.response({ message: locals["order"]["Post"]["error"]["product"] }).code(409);
        }
        let data = {
            "height": payload.height,
            "width": payload.width,
            "color": payload.color,
            "user_id": ObjectId(user.userId),
            "product_id": ObjectId(payload.product_id),
            "status": payload.status,
        }

        const orderResult = await orderCollection.Insert(data)
        const orderPost = await orderCollection.SelectById({ _id: orderResult.insertedId }, {})
        if (orderResult) {
            return res.response({
                message: locals["genericErrMsg"]["200"],
                data: {
                    order: orderPost
                }
            }).code(200);
        } else {
            return res.response({ message: locals["genericErrMsg"]["204"] }).code(204);
        }
    } catch (e) {
        logger.error(e.message)
        return res.response({ message: locals["genericErrMsg"]["500"] }).code(500);
    }
}

const response = {
    status: {
        200: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["200"]), data: Joi.any() }),
        500: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["500"]) }),
        409: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["204"]) }),
    }
}

module.exports = { validator, response, handler }