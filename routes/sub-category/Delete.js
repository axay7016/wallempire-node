"use strict";

const { ObjectID } = require("bson");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const logger = require("winston");
const locals = require("../../locales");
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
    subCatgory_id: Joi.string()
        .min(24)
        .description(
            locals["sub-category"].Delete.fieldsDescription.sub_category_id
        ),
}).unknown();

const handler = async (req, res) => {
    try {
        const query = req.query;
        const SubcategoryResult = await categoryCollection.SelectOne({
            _id: ObjectID(query.subCatgory_id),
        });

        const sectionResult = await categoryCollection.SelectOne({
            _id: SubcategoryResult.section_id,
        });

        const deleteResult = await postCollection.Delete({ sub_category_id: ObjectID(query.subCatgory_id) });

        if (sectionResult.items && sectionResult.items.length > 0) {
            let ids = [];
            sectionResult.items.map((item) => {
                if (item.toString() != query.subCatgory_id) {
                    ids.push(item);
                }
            });
            const updateCategoryResult = await categoryCollection.Update(
                { _id: sectionResult._id },
                {
                    items: ids,
                }
            );
        }
        const subCategoryResult = await categoryCollection.Delete({
            _id: ObjectID(query.subCatgory_id),
        });
        return res
            .response({
                message: locals["genericErrMsg"]["200"],
                data: {
                    category: subCategoryResult,
                },
            })
            .code(200);
    } catch (e) {
        logger.error(e.message);
        return res.response({ message: locals["genericErrMsg"]["500"] }).code(500);
    }
};

const response = {
    status: {
        200: Joi.object({
            message: Joi.any().default(locals["genericErrMsg"]["200"]),
            data: Joi.any(),
        }),
        500: Joi.object({
            message: Joi.any().default(locals["genericErrMsg"]["500"]),
        }),
    },
};

module.exports = { validator, response, handler };
