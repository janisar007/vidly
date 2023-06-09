const winston = require('winston');
const { logger } = require('../startup/logging.js');
const mongoose = require('mongoose'); //an object
const config = require('config');

const db = function() {
    //connection to DB.
    const db = config.get('db'); //here db = 'mongodb://127.0.0.1/vidly'   from vid183
    const con = mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    .then(() => logger.info(`Connected to ${ con.connection.host }...`));
    // .catch(err => console.error('Could not connect to MongoDB...', err)); //now we dont need this catch because isse bas hum console per log kar rahe, isse process trminate nahi ho raha hai. jab mongodb se connect nahi hoga to winston dekh lega.

    //note-> console.log('Connected to MongoDB...') ko winston.info('Connected to MongoDB...') me change krne se terminal per Connected to MongoDB... likh anhi aega. 
}

// const database = async () => {
//   try {
//     const conn = await mongoose.connect(db);
//     console.log(`Connected to ${ db }...`);
//   } catch (error) {
//     logger.info('Could not connect to mongodb..');
//     process.exit(1);
//   }
// }

module.exports = db;