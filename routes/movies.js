const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const auth = require('../middleware/auth.js');
const router = express.Router();


//1. getting all the movies->
router.get('/', async (req, res) => {
    const movies = await Movie.find().sort({ title: 1 });
    res.send(movies);
});

//2. getting specific movie ->
router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if(!movie) {
        res.status(404).send('Movie with given id is not found!!!');
        return;
    }

    res.send(movie);
});

//3.creating new movies ->
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) {
        res.status(400).send('Invalid genre.');
        return;
    }

    const movie = new Movie({ 
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    });

    const result = await movie.save();
    res.send(result);
});

//4.updating movie ->
router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) {
        send.status(404).send(error.details[0].message);
        return;
    }

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    }, { new: true });
    
    if(!movie){
        res.status(404).send('The movie with given id is not found!!!');
        return;
    }

    res.send(movie);
});

//5.delete movies ->
router.delete('/:id', auth, async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if(!movie){
        res.status(404).send('The movie with given id is not found!!!');
        return;
    }

    res.send(movie);
});

module.exports = router;
