require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const mongoose = require('mongoose'); //an object
const Joi = require('joi');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middleware/error.js');
const logger = require('./startup/logging.js');
const config = require('config');
const express = require('express'); //returns object
const app = express(); //in these objects, there are get(), post(), put(), delete() methods
 
//1vvid150,152---------------------------------------------
// process.on('uncaughtException', (ex) => {
//     logger.error('something went wrong during startup', ex);
//     // process.exit(1);
// });
// process.on('unhandledRejection', (ex) => {
//     logger.error('Unhandled Promise Rejection:', ex);
//     // process.exit(1);
// });

//this for handleing uncaught exception and exiting prom process out side of req-res processing pipeline using exceptions.handle method in winston->
winston.exceptions.handle(new winston.transports.File({ filename: 'uncaughtExceptions.log' }));

//this is for unhandled promises using process object in node. so if there is any unhandled promise, a event called unhandledRejection arises and this process.on method catched it and the above winston.exceptions.handle method will log it autometically->
process.on('unhandledRejection', (ex) => {
  throw ex;
});
//1^----------------------------------------------------
// const p = Promise.reject(new Error('Unhandled Promise'));
// p.then(() => console.log('Done'));
// throw new Error('Something worn winston');

if(!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey is not defined.');

    //at last hame auth.js process se exit krna hoga. ti=o uske liye hum node k globle object proccess ka use krenge joki current process ko indicate krta hai.
    process.exit(1); // exit(0) means process is successed, anything else 0 means failure.
}



//connection to DB.
mongoose.connect('mongodb://127.0.0.1/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err)); //err is an obj.


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



const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`listening on port ${port}...`)}); 