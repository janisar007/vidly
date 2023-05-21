const Joi = require('joi');

const validate = function() {
    Joi.objectId = require('joi-objectid')(Joi);
}

module.exports = validate;