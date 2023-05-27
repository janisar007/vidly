
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
const mongoose = require('mongoose');
const express = require('express');
const { Rental } = require('../models/rental');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    if(!req.body.customerId) return res.status(400).send('CustomerId is not provided.');
    if(!req.body.movieId) return res.status(400).send('MovieId is not provided.');

    const rental = await Rental.findOne({ 'customer._id': req.body.customerId, 'movie._id': req.body.movieId });

    if(!rental) return res.status(404).send('Rental not found.');

    if(rental.dateReturned) return res.status(400).send('Rental already processed.');

    rental.dateReturned = new Date(); //vid 208
    
    await rental.save();

    return res.status(200).send('Rental found.');

    //200 wala test pass hote hi hame Unauthorized wala res hata kar auth middleware laga dena hai. q ki ab return se neeche wala code process hi nahi hoga.

    // res.status(401).send('Unauthorized');
    
});

module.exports = router;