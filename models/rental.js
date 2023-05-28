const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const moment = require('moment');

const rentalSchema = new mongoose.Schema({
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

//js me do tarah se method ko define krte hai-> vid213.->
// 1. static-> ye method direct class me hi define hote hai. inhe use krne k liye us class ka object nahi bana padta hai.
//2. instance-> inhe use krne k liye pehle object(instance) banana padta hai. q ki ye methods us perticular object per dependent rahte hai.
//lookup is just a name of method.
//here i am making a static method->
rentalSchema.statics.lookup = function(customerId, movieId) { //vid213.
  //here this is referenced to Rental class.
    return this.findOne({ //we will not await it here. when lookup will called then await it there.
        'customer._id': customerId, 
        'movie._id': movieId 
    });
}

rentalSchema.methods.return = function() { //vid 214.
    this.dateReturned = new Date();

    const rentalDays = moment().diff(this.dateOut, 'days');
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}
 
const Rental = mongoose.model('rental', rentalSchema);

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