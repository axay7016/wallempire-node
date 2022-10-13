'use strict'

const Promise = require("bluebird");
const mongo = Promise.promisifyAll(require('../mongodb'))

const tablename = 'authUser'

const SelectOne = async(data) => {
    const db = await mongo.get();
    return await db.collection(tablename).findOne(data)
};

const Insert = async(data) => {
    const db = await mongo.get();
    return await db.collection(tablename).insertOne(data)
}

const SelectById = async(condition, requiredFeild) => {
    const db = await mongo.get();
    return await db.collection(tablename).findOne(condition, requiredFeild);
}

const Update = async(condition, data) => {
    const db = await mongo.get();
    return await db.collection(tablename).update(condition, { $set: data });
}

module.exports = {
    SelectOne,
    Insert,
    SelectById,
    Update
}