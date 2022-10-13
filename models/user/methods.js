'use strict'
const db = require('../mongodb')
const ObjectID = require('mongodb').ObjectID
const Promise = require("bluebird");
const mongo = Promise.promisifyAll(require('../mongodb'))

const tablename = 'authUser'

const Select = async(condition) => {
    const db = await mongo.get();
    return await db.collection(tablename).find(condition).toArray();
}

const SelectWithSort = async(data, sortBy = {}, porject = {}, skip = 0, limit = 20) => {
    const db = await mongo.get();
    return await db.collection(tablename)
        .find(data)
        .sort(sortBy)
        .project(porject)
        .skip(skip)
        .limit(limit)
        .toArray();
}

const matchList = async(data) => db.get().collection(tablename).aggregate(data);

const SelectOne = async(data) => db.get().collection(tablename).findOne(data);
const SelectById = async(condition, requiredFeild) => {
    const db = await mongo.get();
    return await db.collection(tablename).findOne(condition, requiredFeild);
}

const Insert = async(data) => {
    const db = await mongo.get();
    return await db.collection(tablename).insertOne(data)
}

const Update = async(condition, data) => db.get().collection(tablename).update(condition, { $set: data })

const UpdateById = async(_id, data) => db.get().collection(tablename).update({ _id: ObjectID(_id) }, { $set: data })


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

const Delete = async(condition) => db.get().collection(tablename).remove(condition);

const Aggregate = async(condition) => db.get().collection(tablename).aggregate(condition)

module.exports = {
    Aggregate,
    SelectWithSort,
    Select,
    matchList,
    SelectOne,
    Insert,
    Update,
    SelectById,
    UpdateById,
    Delete,
    UpdateByIdWithAddToSet,
    UpdateByIdWithPush,
    UpdateByIdWithPull
}