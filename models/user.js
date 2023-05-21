const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
        
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },

    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024 //see in the validateUser funtion, that the password is of 255 character because that is what user sends us. but in mongodb the password will be stored as a hash value that is much longer, so here it of 1024 length.
    },

    isAdmin: Boolean

});

//userSchema.methods returns an object jisme hum koi key value pair add kar skte hai. to yaha maine generateAuthToken ko as akey and use age k function ko as value add kar diya hai.
//1v lec140,141--------------------------------------------------------------------
//jwt me ek new property isAdmin bhi bhej rahe hai.
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}
//^----------------------------------------------------------------------
//now jab bhi koi object User class se create hoga us object k ander ye generateAuthToken naam ka function aa jaega jo ki us object ki properties(id, name) k according token create kr dega.

const User = mongoose.model('user', userSchema);

function validateUser(reqBody) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    const result = schema.validate(reqBody);

    return result;
};

module.exports.User = User;
module.exports.validate = validateUser;