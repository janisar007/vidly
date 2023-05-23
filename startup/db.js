const winston = require('winston');
const { logger } = require('../startup/logging.js');
const mongoose = require('mongoose'); //an object
const config = require('config');

const db = function() {
    //connection to DB.
    const db = config.get('db'); //here db = 'mongodb://127.0.0.1/vidly'   from vid183
    mongoose.connect(db)
    .then(() => logger.info(`Connected to ${ db }...`));
    // .catch(err => console.error('Could not connect to MongoDB...', err)); //now we dont need this catch because isse bas hum console per log kar rahe, isse process trminate nahi ho raha hai. jab mongodb se connect nahi hoga to winston dekh lega.

    //note-> console.log('Connected to MongoDB...') ko winston.info('Connected to MongoDB...') me change krne se terminal per Connected to MongoDB... likh anhi aega. 
}

module.exports = db;