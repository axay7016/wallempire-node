"use strict";

const Joi = require("joi");
const { ObjectId } = require("mongodb");
Joi.objectId = require("joi-objectid")(Joi);
const logger = require("winston");
const locals = require("../../locales");
const postCollection = require("../../models/product");

/**
 * @description get all or specifice post details
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
  category_id: Joi.string().description(
    locals["product"].Get.fieldsDescription.category_id
  ),
  sub_category_id: Joi.string().description(
    locals["product"].Get.fieldsDescription.sub_category_id
  ),
  page: Joi.number().description(locals["user"].Get.fieldsDescription.page),
  limit: Joi.number().description(locals["user"].Get.fieldsDescription.limit),
  product_id: Joi.string().description(
    locals["product"].Get.fieldsDescription.sub_category_id
  ),
  productStatus: Joi.string().description(
    locals["product"].Get.fieldsDescription.sub_category_id
  ),
}).unknown();

const handler = async (req, res) => {
  try {
    var postResult;
    let page = req.query.page ? req.query.page : 0;
    let limit = req.query.limit ? req.query.limit : 20;
    let condition = [
      {
        $lookup: {
          from: "category",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $lookup: {
          from: "category",
          localField: "sub_category_id",
          foreignField: "_id",
          as: "sub_category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $unwind: {
          path: "$sub_category",
          preserveNullAndEmptyArrays: false,
        },
      },
    ];

    if (req.query.category_id) {
      condition.push({
        $match: {
          category_id: ObjectId(req.query.category_id),
        },
      });
    } else if (req.query.sub_category_id) {
      condition.push({
        $match: {
          sub_category_id: ObjectId(req.query.sub_category_id),
        },
      });
    } else if (req.query.product_id) {
      condition.push({
        $match: {
          _id: ObjectId(req.query.product_id),
        },
      });
    } else if (req.query.productStatus) {
      condition.push({
        $match: {
          productStatus: req.query.productStatus,
        },
      });
    }

    condition.push(
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          productRes: { $push: "$$ROOT" },
        },
      },
      { $sort: { _id: -1 } },
      {
        $project: {
          _id: 0,
          count: 1,
          post: { $slice: ["$productRes", page * limit, limit] },
        },
      }
    );
    postResult = await JSON.parse(
      JSON.stringify(await postCollection.Aggregate(condition))
    );

    return res
      .response({
        message: locals["genericErrMsg"]["200"],
        data: postResult[0],
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
