const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const rental = new mongoose.Schema({
  customer: { 
    //yaha hum type me customer k liye new schema define kar rahe hai na ki customer.js se import kar k use kr rahe hai. aesa is liye q ki ho sakta ho imported cutomer schema me 50 property ho lekin hame 3 ki hi jarurat hai. is liye new schema ko accordingly bana liya hai.
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      isGold: {
        type: Boolean,
        default: false
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      }      
    }),  
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 255
      },
      dailyRentalRate: {  //we will use this to calculate the rental fee.
        type: Number, 
        required: true,
        min: 0,
        max: 255
      }   
    }),
    required: true
  },
  dateOut: { //jis date ko movie rent hui ho.
    type: Date, 
    required: true,
    default: Date.now //default value aj ki date hai. 
  },
  dateReturned: { 
    type: Date //jis date ko movie return kiya jaega. is liye ise required nahi kiya hai.
  },
  rentalFee: { 
    type: Number, 
    min: 0
  }
});
const Rental = mongoose.model('rental', rental);

function validateRental(rental) {
  const schema = {
    //yaha hume bas client se ids of customer and movies chahiye. hame dateOut, dateReturned and retalFee nahi chahiye q ki ye server side per set kiye jaenge isliye validation ki jarurat nahi hai.
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
    //so while creating a new rental client will send only customerId and movieId.
  };

  return Joi.validate(rental, schema);
}

exports.Rental = Rental; 
exports.validate = validateRental;