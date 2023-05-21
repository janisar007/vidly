const config = require('config');

const configEnv = function() {
    if(!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.'); //here i am not logging error massage on the colsole insted i am throwing new error object. that will store in logfile.log. with trase stack.




        // console.log('FATAL ERROR: jwtPrivateKey is not defined.');
    
        // //at last hame auth.js process se exit krna hoga. ti=o uske liye hum node k globle object proccess ka use krenge joki current process ko indicate krta hai.
        // process.exit(1); // exit(0) means process is successed, anything else 0 means failure.
    }
}
exports.configEnv = configEnv;

