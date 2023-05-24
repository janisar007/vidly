const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { genreSchema } = require('./genre');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true, //extra padding hatane k liye.
        minlength: 5,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        rquired: true,
        min: 0,
        max: 255
    }
});

const Movie = mongoose.model('movies', movieSchema);

function validateMovies(reqBody) {

    const schema = {
        title: Joi.string().min(5).max(50).required(),
        //this is what aur client give as through api witch is genreId ->
        genreId: Joi.objectId().required(), //Note ye objectId function sirf req ki body ki Id ko check krta hai. ye function route k parameter me bheji gai id per work nahi karega. to uske liye hame ek middleware function define krna hoga. jo ki middleware/validateObjectId.js me define hai. vid187,188
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    }
    const result = Joi.validate(reqBody, schema);
    return result;
}

module.exports.Movie = Movie;
module.exports.validate = validateMovies;