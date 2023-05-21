
const Joi = require('joi');

const config = require('config');
const express = require('express'); //returns object
const app = express(); //in these objects, there are get(), post(), put(), delete() methods

//1vvid155-shifting winston and stuff---------------------
//here i am putting it before rrequire(routes) and require(db). q ki agr koi error aye to sabse pehle winston hi sambhal le.
const { unhandledExc_Rej } = require('./startup/logging.js');
unhandledExc_Rej();
//1^-----------------------------------

require('./startup/routes.js')(app); // require('./startup/routes') hame ek function dega jisme hum app ko pass kark us function ko call kr denge simple.

require('./startup/db.js')();
 

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