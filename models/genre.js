const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
});

//now creating model (or Genre class) based on genreSchema ->
//and genre is the singular name of genres collection, that will be created in the vidly db whenwe first add any genre->
const Genre = mongoose.model('genre', genreSchema); //class created

//validateRequest(req.body);
function validateRequest(reqBody) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });

    const result = schema.validate(reqBody);
    return result;
}


module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validate = validateRequest;