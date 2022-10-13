'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const postCollection = require("../../models/product");
const logger = require('winston');
const locals = require('../../locales');
const { ObjectId } = require('mongodb');
const { uploadImage } = require('../../library/cloudinary');
const categoryCollection = require("../../models/categories");
/**
 * @description post a new post
 * @property {string} authorization - authorization
 * @property {string} lang - language
 * @property {string} postName - for select specific post details
 * @returns 200 : Success
 * @returns 500 : Internal Server Error
 * 
 * @author Vatsal Sorathiya
 * @date 11-Dec-2020
 */

const validator = Joi.object({
    postName: Joi.string().required().description(locals['product'].Post.fieldsDescription.postName),
    description: Joi.string().required().description(locals['product'].Post.fieldsDescription.description),
    price: Joi.number().required().description(locals['product'].Post.fieldsDescription.price),
    category_id: Joi.string().min(24).required().description(locals['product'].Post.fieldsDescription.category_id),
    sub_category_id: Joi.string().min(24).description(locals['product'].Post.fieldsDescription.category_id),
    productStatus: Joi.string().valid('premium', 'non-premium').required().description(locals['product'].Post.fieldsDescription.category_id),
    postImage1: Joi.any().meta({ swaggerType: 'file' }).required().description(locals['product'].Post.fieldsDescription.postImage),
    postImage2: Joi.any().meta({ swaggerType: 'file' }).required().description(locals['product'].Post.fieldsDescription.postImage),
    postImage3: Joi.any().meta({ swaggerType: 'file' }).required().description(locals['product'].Post.fieldsDescription.postImage),
    postImage4: Joi.any().meta({ swaggerType: 'file' }).required().description(locals['product'].Post.fieldsDescription.postImage),
    width: Joi.string().required().description(locals['product'].Post.fieldsDescription.width),
    composition: Joi.string().required().description(locals['product'].Post.fieldsDescription.composition),
    repeat_size: Joi.string().required().description(locals['product'].Post.fieldsDescription.repeat_size),
    weight_gsm: Joi.string().required().description(locals['product'].Post.fieldsDescription.weight_gsm),
    end_use: Joi.array().required().description(locals['product'].Post.fieldsDescription.end_use),
}).unknown();

const handler = async (req, res) => {
    try {
        const payload = req.payload

        const categoryResult = await categoryCollection.SelectOne({
            _id: ObjectId(payload.category_id),
        })
        if (!categoryResult) {
            return res.response({ message: locals['product'].Post.error.category_id }).code(409);
        }

        const subCategoryResult = await categoryCollection.SelectOne({
            _id: ObjectId(payload.sub_category_id),
            type: "sub-category"
        })

        if (!subCategoryResult) {
            return res.response({ message: locals['product'].Post.error.sub_category_id }).code(409);
        }

        // const response1 = await uploadImage(payload.postImage1, 'product')
        // const response2 = await uploadImage(payload.postImage2, 'product')
        // const response3 = await uploadImage(payload.postImage3, 'product')
        // const response4 = await uploadImage(payload.postImage4, 'product')
        let data = {}
        data = {
            "postName": payload.postName,
            "description": payload.description,
            "postImage1": payload.postImage1,
            "postImage2": payload.postImage2,
            "postImage3": payload.postImage3,
            "postImage4": payload.postImage4,
            "productStatus": payload.productStatus,
            "price": payload.price,
            "category_id": ObjectId(payload.category_id),
            "sub_category_id": ObjectId(payload.sub_category_id),
            "width": payload.width,
            "composition": payload.composition,
            "repeat_size": payload.repeat_size,
            "weight_gsm": payload.weight_gsm,
            "end_use": payload.end_use
        }

        const postResult = await postCollection.Insert(data)
        const findPost = await postCollection.SelectById({ _id: postResult.insertedId }, {})
        if (postResult) {
            return res.response({
                message: locals["genericErrMsg"]["200"],
                data: findPost
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
        500: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["500"]) }),
    }
}

module.exports = { validator, response, handler }