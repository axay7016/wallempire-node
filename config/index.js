'use strict'

const logger = require('./components/logger');
const mongodb = require('./components/mongo');
const server = require('./components/server');
const localization = require('./components/localization');
const cloudinary = require('./components/cloudinary');

module.exports = Object.assign({}, logger, mongodb, server, localization, cloudinary);