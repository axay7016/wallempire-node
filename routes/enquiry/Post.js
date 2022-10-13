'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../locales');
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');
const enquiryCollection = require("../../models/enquiry");
const nodemailer = require('nodemailer');   
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
    name: Joi.string().required().description(locals['enquiry'].Post.fieldsDescription.name),
    contact_number: Joi.string().required().description(locals['enquiry'].Post.fieldsDescription.contact_number),
    email: Joi.string().required().description(locals['enquiry'].Post.fieldsDescription.email),
    enquiry_details: Joi.string().required().description(locals['enquiry'].Post.fieldsDescription.enquiry_details),
}).unknown();

const handler = async (req, res) => {
    try {
        let data ={}
        
        const payload = req.payload
        data = {
            "name": payload.name,
            "contact_number": payload.contact_number,
            "email": payload.email,
            "enquiry_details": payload.enquiry_details,
        }
        if(req.headers.authorization.length > 40){
            let authorization = req.headers.authorization.split(' ')[1]
            let user = jwt.decode(authorization)
            data.user_id = ObjectId(user.userId)
        }

        const transporter = nodemailer.createTransport({
            service:"goDaddy",
            host: "smtp.office365.com",
            port: "587",
            secure: false,
            requireTLS: true,
            auth: {
               user: process.env.EMAIL,
               pass: process.env.PASSWORD
           },
           tls: {
               ciphers:'SSLv3',
               rejectUnauthorized: false 
           }
        });

        let sendMessage = {
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: "Enquiry from "+payload.name,
            html: `
            <hr />
                <span>Name : ${payload.name}</span><br/><br/>
                <span>Email : ${payload.email}</span><br/><br/>
                <span>Phone : ${payload.contact_number || "No phone"}</span><br/><br/>
                <span>Message :</span><br/>
                <p>${payload.enquiry_details || "No message"}</p>
            <hr />
            `
        }
        transporter.sendMail(sendMessage, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log('sent', info);
            }
        });
        const enquiryResult = await enquiryCollection.Insert(data)
        const enquiry = await enquiryCollection.SelectById({ _id: enquiryResult.insertedId }, {})
        if (enquiryResult) {
            return res.response({
                message: locals["genericErrMsg"]["200"],
                data: {
                    enquiry: enquiry
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