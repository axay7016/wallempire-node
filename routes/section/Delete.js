'use strict'

const { ObjectID } = require('bson');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../locales');
const categoryCollection = require("../../models/categories");
const postCollection = require("../../models/product");

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
    section_id: Joi.string().min(24).description(locals['sub-category'].Delete.fieldsDescription.sub_category_id)
}).unknown();

const handler = async(req, res) => {
    try {
        const query = req.query
        if(query.section_id){
            const getCategoryResult = await categoryCollection.SelectOne({
                section:ObjectID(query.section_id)
            })
            if(getCategoryResult.section && getCategoryResult.section.length > 0){
                let section_ids=getCategoryResult.section;
                let ids = [];
                section_ids.map((item)=>{
                    if(item.toString() != query.section_id){
                        ids.push(item)
                    }
                })
                const updateCategoryResult = await categoryCollection.Update({_id:getCategoryResult._id},{
                    section:ids
                })
            }

            const getsectionResult = await categoryCollection.SelectOne({
                _id:ObjectID(query.section_id)
            })

            if(getsectionResult.items && getsectionResult.items.length > 0){
                getsectionResult.items.map(async(item)=>{
                    const deleteResult = await postCollection.Delete({ sub_category_id: item })
                })
                const deleteSubCategoryResult = await categoryCollection.Delete({
                                section_id:ObjectID(query.section_id)
                            })
            }
             const sectionResult = await categoryCollection.Delete({
                _id:ObjectID(query.section_id)
            })

          
             return res.response({
                 message: locals["genericErrMsg"]["200"],
                 data: {
                     category: sectionResult
                 }
             }).code(200);
        }else{
            
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

module.exports = { validator,response, handler }