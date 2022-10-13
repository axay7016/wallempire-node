'use strict'
const db = require('../mongodb')
const ObjectID = require('mongodb').ObjectID
const Promise = require("bluebird");
const mongo = Promise.promisifyAll(require('../mongodb'))

const tablename = 'product'

const Select = async(condition) => {
    const db = await mongo.get();
    return await db.collection(tablename).find(condition).toArray();
}

const SelectById = async(condition, requiredFeild) => {
    const db = await mongo.get();
    return await db.collection(tablename).findOne(condition, requiredFeild);
}

const Insert = async(data) => {
    const db = await mongo.get();
    return await db.collection(tablename).insertOne(data)
}

const UpdateByIdWithAddToSet = async(condition, data) => {
    condition._id = await ObjectID(condition._id)
    return await db.get().collection(tablename).update(condition, { $addToSet: data })
}

const UpdateByIdWithPush = async(condition, data) => {
    condition._id = await ObjectID(condition._id)
    return await db.get().collection(tablename).update(condition, { $push: data })
}

const UpdateByIdWithPull = async(condition, data) => {
    condition._id = await ObjectID(condition._id)
    return await db.get().collection(tablename).update(condition, { $pull: data })
}

const Aggregate = async(condition) => {
    const db = await mongo.get();
    return await db.collection(tablename).aggregate(condition).toArray()
}

const Update = async(condition, data) => {
    const db = await mongo.get();
    return await db.collection(tablename).updateOne(condition, { $set: data });
}

const Delete = async (condition) => {
    const db = await mongo.get();
    return await db.collection(tablename).remove(condition);
}

module.exports = {
    Select,
    Insert,
    SelectById,
    UpdateByIdWithAddToSet,
    UpdateByIdWithPush,
    UpdateByIdWithPull,
    Aggregate,
    Update,
    Delete
}