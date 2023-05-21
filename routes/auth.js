//we dont want this validate. q ki ye to bash ye chek karte hai ki jo function hai wo new user ko validate krne k liye hai q ki ye function name, email, pass sab validate krta hai. per hame to already existed user ko log in k samay validate krna hai. jiske liye sirf pass aur email ko hi validate krna hoga to uske liye hum ek seperate valid function yahi likh lete hai.
// const {User, validate} = require('../models/user');

const { User } = require('../models/user');
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');


const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
        

    //first authenticationg email ->
    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Invalid email or passward.');

    //then authenticating password ->
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or passward.');

//1v lec135-----------------------------------------------------------------
    // const token = jwt.sign({ _id: user._id }, 'jwtPrivateKey');
    // const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));

    //ab yaha baat ye ho gayi ki same token yaha bhi generate kiya ja raha hai aur yahi token user.js me bhi generate ho raha hai. lekin kya ho agar hum future me payload(first parameter in jwt.sign()) me kuch aur bhi add krna chahe. phir to hame har jagah hi ja kar change krna hoga.
    //iske liye hum user object k ander ek custom method define karege jo ki ye token generate krta ho aur jise har file user object k ek method ki tarah use kr sake.
    //NOTE: ye method hame models/user.js me define kr na hoga. q ki payload me user ki properties ka hi use kiya ja raha hai to usi ka haq banata hai. ab baaki function ki definition models/user.js e hai.
    const token = user.generateAuthToken();

//1^---------------------------------------------------------------------------
    res.send(token);
});


function validate(reqBody) {
    const schema = {
        // name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    }
    const result = Joi.validate(reqBody, schema);

    return result;
}

module.exports = router;
