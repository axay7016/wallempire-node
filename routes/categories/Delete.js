'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const categoryCollection = require("../../models/categories");
const logger = require('winston');
const locals = require('../../locales');
const { ObjectId } = require('mongodb');
const postCollection = require("../../models/product");

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
    category_id: Joi.string().required().description(locals['category'].Post.fieldsDescription.categoryName),
}).unknown();

const handler = async(req, res) => {
    try {
        const query = req.query
        const findCategory = await categoryCollection.SelectById({ _id: ObjectId(query.category_id) })
        if (findCategory) {
            if(findCategory.section && findCategory.section.length > 0){
                findCategory.section.map(async(item)=>{
                    const getsectionResult = await categoryCollection.SelectOne({
                        _id:item
                    })
                    console.log(getsectionResult)
                    if(getsectionResult && getsectionResult.items.length > 0){
                        getsectionResult.items.map(async(item)=>{
                            const deleteResult = await postCollection.Delete({ sub_category_id: item })
                        })
                        const deleteSubCategoryResult = await categoryCollection.Delete({
                                        section_id:item
                                    })
                    }
                    const deletesectionResult = await categoryCollection.Delete({
                        _id:item
                    })
                })
            }
            const deleteCategory = await categoryCollection.Delete({ _id: ObjectId(query.category_id) })
            return res.response({
                message: locals["genericErrMsg"]["200"],
                data: {
                    category: deleteCategory
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