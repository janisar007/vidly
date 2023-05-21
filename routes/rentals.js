const {Rental, validate} = require('../models/rental'); 
const {Movie} = require('../models/movie'); 
const {Customer} = require('../models/customer'); 
const mongoose = require('mongoose');
//const Fawn = require('fawn'); //since it is a class, we have to write its initiallize method.
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

//initiallize method->
//Fawn.init(mongoose); //perameter me line 4 ka mongoose object pass kiya gaya hai. 



//1. getting all rentals ->
router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut'); //yaha hum dateOut k decending order me get kar rahe hai.
  res.send(rentals);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  //hame ye bhi check karna hoga rent krne se pehle ki hamare stock me hai bhi ya nahi.
  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  const rental = new Rental({ 
    customer: {
      _id: customer._id,
      name: customer.name, 
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  // const result = await rental.save();
  // movie.numberInStock--;
  // movie.save();
  //  Now we do not have to create and save the rental explicitly. instead we are going create a task object which is like a transaction ->

  // try{
  //     new Fawn.Task()
  //       .save('rentals', rental) //save('nameOfCollectionInPlural', theNewRentalThatWeHaveCreated)
  //       .update('movies', { _id: movie._id }, { //dosra parameter ek query object hai.
  //         $inc: { numberInStock: -1 }
  //       })
  //       .run(); //akhiri me run() likhna hota hai nahi to above operations nahi lagenge.
      
  //     res.send(result);
  // } 
  // catch(ex) {
  //     res.status(500).send('Something failed.'); //internal server error.
  // }

  const result = await rental.save();
  movie.numberInStock--;
  movie.save();
  rental.send(result);

});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

module.exports = router; 