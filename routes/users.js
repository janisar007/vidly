const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth.js');

const express = require('express');
const router = express.Router();

//1v---------------------------------------------------------
//get current user -> kabhi kabhi hum chahte hai i currently logged user k baare me info pata chal sake.
//waise to hum log '/me' ki jagah per '/:id' bhejte hai. per chu ki aise to koi bhi user ki id bhej kar uske baare me pata laga sakta hai is liye hum jwt se id ko le kar us user k baare me info send karenge.
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password'); //middleware/auth.js ne user ki id jwt se nikal kar req k body me daal di thi.
    res.send(user);
});
//1^--------------------------------------------------------------

//Post->
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
        

    //here we also have to check if the user already registered ->
    let result = await User.findOne({ email: req.body.email });
    if(result) return res.status(400).send('User already registered.');

    // const user = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // });
    //or we can use lodash npmpackage which has pick() method to pick specific properties from an object. 
    //the syntax of the pick method is -> _.pick(THE_OBJECT_NAME, [array of properties you want to pick from this object])
    const user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    result = await user.save();   

    // res.send(result);
    //ab q ki hum yaha ye nahi chante ki user ka password bhi client ko send ho jaye isliye res me sirf specific cheej hi bhejenge ->
    // res.send({
    //     name: user.name, //or result.name
    //     email: user.email //or result.email
    // });

    //or we can use lodash npmpackage which has pick() method to pick specific properties from an object. 
    //the syntax of the pick method is -> _.pick(THE_OBJECT_NAME, [array of properties you want to pick from this object])

    //hum chahte hai ki jab first time user regiser kare on users.js per to use seperately login na karna pade. iske liye hum use register krne per hi jwt de denge->
//1v lec135-------------------------------------------------------------------
    // const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
    const token = user.generateAuthToken(); //this function is defined in models/user.js
    //all reason for this change is in auth.js at line29 to 36.
//1^-------------------------------------------------------------------

    //ab q ki hum token ko directly user k id, name, email k sath nahi bhej sakte hai q ki jwt user ki koi property to hai nahi. is liye use response k header me bhejenge. ye header hame postman me ek seperate column me mil jaega jiske ander jwt 'x-auth_token' k samne likha hoga. jaha x- ek prefix hai jo ki by convension likha jata hai, agar hum manully koi header define krte hai. to yaha auth-token(can be anything) ek manual header name hai. (Note: See vid134)->
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));

});

module.exports = router;
