const categories = require('./categories');
const section = require('./section');
const subCategory = require('./sub-category');
const product = require('./product');
const signIn = require('./signIn');
const signUp = require('./signUp');
const guestToken = require('./guestToken');
const featureProduct = require('./featureproduct');
const banner = require('./banner');
const order = require('./order');
const enquiry = require('./enquiry');
const user = require('./user');

module.exports = [].concat(
    categories,
    section,
    signIn,
    signUp,
    guestToken,
    product,
    featureProduct,
    banner,
    order,
    enquiry,
    subCategory,
    user
)