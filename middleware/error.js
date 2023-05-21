const { logger } = require('../startup/logging.js'); //vid148
//here err is the exception(ex) that throws the catch block. in genres.js->

//this error middleware in express chatches any error in request processing pipeline.
const error = function(err, req, res, next) { //this is called error middleware function which is in express. we register this middleware function after all the middleware function in index.js.
    //log the exception->
    logger.error(err.message, err);
    //error
    //warn
    //info
    //verbose
    //debug
    //silly
    
    res.status(500).send('Something failed.');
}

module.exports = error;
