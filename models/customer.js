const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    number: {
        type: String,
        required: true
    }
});

const Customer = mongoose.model('customer', customerSchema); //class created.

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(3).required(),
        isGold: Joi.boolean().required(),  
        number: Joi.string().required()
    };

    return Joi.validate(customer, schema);
}

//now ab hame line number 21 ki Customer class aur line 23 ka function export karana hai ->

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;