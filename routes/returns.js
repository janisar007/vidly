
//POST /api/returns {customerId, movieId}

//test that we can think of ->
//all negative tests->
//1. return 401 if clent is not logged in
//2. return 400 if customerId is not provied
//3. return 400 if movieId is not provied
//4. return 404 if no retal found for this customer/movie
//5. return 400(bad request) if rental already processed (rental already calculated)

//positive test ->
//6. return 200 if valid request
//7. set the return date
//8. calculate the rental fee
//9. increase the stock
//10. return the rental
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const router = express.Router();

//adding of validate middleware is from vid212
router.post('/', [auth, validate(validateReturn)], async (req, res) => {
    // joi validation logic is moved in to validate() middleware. vid212.

    //moving Rental.findeOne() into models/rental.js k class k ek static method k roop me(called lookup). vid213->
    // const rental = await Rental.findOne({ 
    //     'customer._id': req.body.customerId, 
    //     'movie._id': req.body.movieId 
    // }); //moved into models/rental.js as a static method(called lookup)
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId); //vid213.

    if(!rental) return res.status(404).send('Rental not found.');

    if(rental.dateReturned) return res.status(400).send('Rental already processed.');

//1v-vid214--------------------------------------------
    //moving -> dateReturn aur rentalFee ko set krne wala logic Rental class k object me move kr rahe hai. vid214

    // rental.dateReturned = new Date(); //vid 208

    // //vid 209 ->
    // //moment() will get the current dateTime
    // const rentalDays = moment().diff(rental.dateOut, 'days');
    // rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;


    rental.return(); //vid214. return function ateReturn aur rentalFee ko set krta hai jo ki Rental class me defined as a method of its object.
    //1^---------------------------------------------------------
    await rental.save();

    //update first method->
    // await Movie.update({ _id: rental.movie._id }, { 
    //         $inc: { 
    //             numberInStock: 1
    //         }
    // });

    const movie = await Movie.findById(rental.movie._id); //here i used query first method q ki update first method chal nahi raha tha.
    movie.set({
       numberInStock:  movie.numberInStock + 1
    });
    await movie.save();

    return res.send(rental);

    //200 wala test pass hote hi hame Unauthorized wala res hata kar auth middleware laga dena hai. q ki ab return se neeche wala code process hi nahi hoga.

    // res.status(401).send('Unauthorized');
    
});

function validateReturn(reqBody) {
     const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });

    const result = schema.validate(reqBody);
    return result;
  }


module.exports = router; 