require('express-async-errors');
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
    
    transports: [
        new winston.transports.Console()
    ],

    exceptionHandlers: [
        new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    ],

    rejectionHandlers: [
        new winston.transports.File({ filename: 'uncaughtExceptions.log' }) 
    ],
    exitOnError: false // Prevent process exit on error
});
//1v155------------------------------
const unhandledExc_Rej = function() {
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
}
exports.unhandledExc_Rej = unhandledExc_Rej;
exports.logger = logger;

//1^-----------------------------------------------------