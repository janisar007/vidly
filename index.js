require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const Joi = require('joi');

const logger = require('./startup/logging.js');
const config = require('config');
const express = require('express'); //returns object
const app = express(); //in these objects, there are get(), post(), put(), delete() methods
require('./startup/routes.js')(app); // require('./startup/routes') hame ek function dega jisme hum app ko pass kark us function ko call kr denge simple.

//1vvid154----------------------
require('./startup/db.js')();
//1^-----------------------------------
 
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










const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`listening on port ${port}...`)}); 