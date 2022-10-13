'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const categoryCollection = require("../../models/categories");
const logger = require('winston');
const locals = require('../../locales');
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const { uploadImage } = require('../../library/cloudinary');


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
    categoryName: Joi.string().required().description(locals['category'].Post.fieldsDescription.categoryName),
    categoryImage: Joi.any().meta({ swaggerType: 'file' }).description(locals['category'].Post.fieldsDescription.categoryImage),
    categoryStatus: Joi.string().required().description(locals['category'].Post.fieldsDescription.categoryStatus),
    featuredProducts: Joi.array().description(locals['category'].Post.fieldsDescription.categoryStatus)
}).unknown();

const handler = async(req, res) => {
    try {
        const payload = req.payload
        const cloudinaryImage = await uploadImage(payload.categoryImage, 'category')
        
        const categoryResult = await categoryCollection.Insert({
            name: payload.categoryName,
            image: cloudinaryImage,
            status: payload.categoryStatus,
            featuredProducts: payload.featuredProducts ? payload.featuredProducts : [],
            type: "category",
            section: []
        });

        const findCategory = await categoryCollection.SelectById({ _id: categoryResult.insertedId }, {})
        if (categoryResult) {
            return res.response({
                message: locals["genericErrMsg"]["200"],
                data: {
                    category: findCategory
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
        204: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["204"]) }),
        500: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["500"]) }),
    }
}

module.exports = { validator, response, handler }