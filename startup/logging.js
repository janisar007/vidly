//all this is from vid1148to151
const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: 'logfile.log' }),

        new winston.transports.MongoDB({
            level: 'error',
            db: 'mongodb://127.0.0.1/vidly',
            colletion: 'error-logs'
        })
    ],

    exceptionHandlers: [
        new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    ],

    rejectionHandlers: [
        new winston.transports.File({ filename: 'uncaughtExceptions.log' }) 
    ],
    exitOnError: false // Prevent process exit on error
});

module.exports = logger;