const Joi = require('joi');

const express = require('express'); //returns object
const app = express(); //in these objects, there are get(), post(), put(), delete() methods

//here i am putting it before rrequire(routes) and require(db). q ki agr koi error aye to sabse pehle winston hi sambhal le.
const { unhandledExc_Rej } = require('./startup/logging.js');
unhandledExc_Rej();

require('./startup/routes.js')(app); // require('./startup/routes') hame ek function dega jisme hum app ko pass kark us function ko call kr denge simple.

require('./startup/db.js')();

//1vvid156-shifting env validation and congif------------------
require('./startup/config.js')();
//1^-----------------------------------
 

// const p = Promise.reject(new Error('Unhandled Promise'));
// p.then(() => console.log('Done'));
// throw new Error('Something worn winston');

const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`listening on port ${port}...`)}); 