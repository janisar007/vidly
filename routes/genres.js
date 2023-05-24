// mongoose install krne k baad hum yaha use require kr k connect nahi krenge. q ki hum chahte hai jaise app start ho, mongoose applicaion level per ek hi baar connect ho jaye, baar baar na karana pade. to hum mongoose ko index.js me require aur connect karaenge---
//---lekin hame yaha mongoose ko require krna padega per connection wala part index.js me hi ek baar hoga.
const {Genre, validate} = require('../models/genre');
const auth = require('../middleware/auth.js');
const admin = require('../middleware/admin.js');
// const asyncMiddleware = require('../middleware/async.js');
const validateObjectId = require('../middleware/validateObjectId');

const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


//1vlec146 removing try catch block---------------------------------------------------
//1. showing all the genres->
// router.get('/', async (req, res, next) => {
//     try {
//         const genres = await Genre.find().sort({ name: 1 }); 
//         res.send(genres);

//     } catch (ex) {
//         // res.status(500).send('Something failed.'); //in future ho skta hai hame send k ander ka masg change krna pade jiske liye har ek route me ja kar change krna hoga to ise hum idex.js me hi define kr dete hai as registering middleware.
//         next(ex); //ye index.js me last wala middleware hai, named app.use(error);. is middle ware ko index.js me sabhi other middleware  kbaad hi likh gaya hai taki ye get() router k baad apne ap hi activate ho jaye as next midddleware.
//     }
// });

// ###Removing try catch block ->
//Now this try catch thing is making extra noise. so we have to move it in a different function. to aesa krne k liye hum apne route handler function ko ek dosre function()named asyncMiddleware k ander pass krke is function ko call kar denge, jo ki hame ek standard express router function with trycatch block return karega->
router.get('/', async (req, res) => {
    // throw new Error('Something worn winston');
    const genres = await Genre.find().sort({ name: 1 }); 
    res.send(genres);
    
});

//one last thing, we have to write this function(asyncMiddleware()) in another file ->
// function asyncMiddleware(handler) {
//     return async (req, res, next) => {
//         try {
//             await handler(req, res); //we have to call this handler function because express will call the returned funciton.
//         }
//         catch(ex) {
//             next(ex);
//         }
//     };
// }
//1^--------------------------------------------------------------

//2.showing specific genre->
router.get('/:id', validateObjectId, async (req, res) => { //this validateObjectId middleware added in vid188.
    const genre = await Genre.findById(req.params.id);
    if(!genre) {
        res.status(404).send('Gener with given id is not found!!!');
        return;   
    }

    res.send(genre);
});

//3.creating new genre->
router.post('/', auth, async (req, res) => { //second argument can be a middleware function. which is for autherization of the user.

    const {error} = validate(req.body);
    if(error){
        res.status(404).send(error.details[0].message);
        return;
    }

    const genre = new Genre({ name: req.body.name });

    const result = await genre.save();

    res.send(result);
});

// 4.updating genre->
router.put('/:id', auth, async (req, res) => {
    const {error} = validate(req.body);
    if(error){
        res.status(404).send(error.details[0].message);
        return;
    }

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true }); //new: true means we want to print updated document.

    if(!genre){
        res.status(404).send('The genre with given id is not found!!!');
        return;
    }

    res.send(genre); 
});

// 5.delete a genre->

//yaha do do middleware in an array k form me pass kiya. aur ye middleware sequence k hisaab se execute honge means pehle auth then admin then router->(lec 140, 141)
router.delete('/:id', [auth, admin], async (req, res) => {

    const genre = await Genre.findByIdAndRemove(req.params.id);

    if(!genre){
        res.status(404).send('The genre with given id is not found!!!');
        return;
    }

    res.send(genre);
});

//exporting router
module.exports = router