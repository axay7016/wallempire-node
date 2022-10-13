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
    section_id: Joi.string().required().description(locals['sub-category'].Post.fieldsDescription.section_id),
    categoryName: Joi.string().required().description(locals['sub-category'].Post.fieldsDescription.categoryName),
    description: Joi.string().required().description(locals['sub-category'].Post.fieldsDescription.description),
}).unknown();

const handler = async (req, res) => {
    try {
        const payload = req.payload

        const sectionResult = await categoryCollection.SelectOne({
            section: ObjectId(payload.section_id),
        })

        if (sectionResult) {
            const subcategory = await categoryCollection.Insert({
                type: "sub-category",
                name: payload.categoryName,
                description: payload.description,
                status: true,
                section_id: ObjectId(payload.section_id)
            })

            await categoryCollection.UpdateSection({
                _id: ObjectId(payload.section_id)
            }, {
                items: subcategory.insertedId
            })

            const subCategoryResult = await categoryCollection.SelectById({ _id: subcategory.insertedId, type: 'sub-category' }, {})
            if (subCategoryResult) {
                return res.response({
                    message: locals["genericErrMsg"]["200"],
                    data: subCategoryResult
                })
            } else {
                return res.response({ message: "section not process" }).code(204);
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