const express = require('express');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error.js');

const routes = function(app) {
    //Here we are registering all middleware function (app.use() is a middleware function)--->
    app.use(express.json());

    //to use all routes in the genres.js file.
    app.use('/api/genres', genres); //hum yaha express ko keh rahe hai ki for any route which starts with '/api/genres' , use courses router (the router, we have loaded from genres module.).

    app.use('/api/customers', customers); //hum yaha express ko keh rahe hai ki for any route which starts with '/api/customers' , use customer router (the router, we have loaded from customers module.).

    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    app.use('/api/auth', auth);

    //1v-vid144,145------------------------------------------------
    //since ham chahte hai ki ye middleware function ek dam last me execute ho is liye maine ise index.js me above abhi middleware function (app.use()) k baad likha hai. yaani sabse pehle sabhi uper wale run honge phir ek dam last me ye middleware func run hoga.
    //here err is the exception(ex) that throws the catch block. in genres.js->
    // app.use(function(err, req, res, next) { 
    //     //log the exception.
    //     res.status(500).send('Something failed.');
    // });
    //one more thing -> in real world application this logging the exception can be vary long. islye is function ko hame ek middleware/error.js me sift krna hoga.
    app.use(error); //this is called error middleware function which is in express. we register this middleware function after all the middleware function.
    //1^---------------------------------------------------------------
}

module.exports = routes;