'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const categoryCollection = require("../../models/categories");
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
    parentCategoryId: Joi.string().required().description(locals['section'].Post.fieldsDescription.parentCategoryId),
    categoryName: Joi.string().required().description(locals['section'].Post.fieldsDescription.categoryName),
    categoryStatus: Joi.string().required().description(locals['section'].Post.fieldsDescription.categoryStatus),
    items: Joi.array().required().description(locals['section'].Post.fieldsDescription.items)
}).unknown();

const handler = async(req, res) => {
    try {
        const payload = req.payload

        const categoryResult = await categoryCollection.SelectOne({
            _id: ObjectId(payload.parentCategoryId),
        })

        if (categoryResult) {

            const checkSectionResult = await categoryCollection.SelectOne({
                type: "section",
                name: payload.categoryName,
                status: true,
            })

            if (checkSectionResult) {
                const subcategory = await categoryCollection.Insert({
                    type: "section",
                    name: payload.categoryName,
                    status: payload.categoryStatus,
                    items: payload.items,
                    status: true
                })

                await categoryCollection.UpdateSection({
                    _id: ObjectId(payload.parentCategoryId)
                }, {
                    section: subcategory.insertedId
                })

                const sectionResult = await categoryCollection.SelectById({ _id: subcategory.insertedId, type: 'section' }, {})
                if (sectionResult) {
                    return res.response({
                        message: locals["genericErrMsg"]["200"],
                        data: sectionResult
                    })
                } else {
                    return res.response({ message: "section not process" }).code(204);
                }
            } else {
                return res.response({ message: locals["genericErrMsg"]["409"] }).code(409)
            }
        } else {
            return res.response({ message: "parent category not found" }).code(204);
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
        409: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["409"]) }),
        500: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["500"]) }),
    }
}

module.exports = { validator, response, handler }