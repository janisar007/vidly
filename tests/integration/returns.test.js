const request = require('supertest');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');
const mongoose = require('mongoose');
const moment = require('moment');


describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let movie;
    let token;

    const exec = () => {
        return request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({ customerId: customerId, movieId: movieId });
    };

    beforeEach( async () => { 
        server = require('../../index'); 

        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: 'Terminator',
            dailyRentalRate: 2,
            genre: { name: 'Sci-fi' },
            numberInStock: 10
        });
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: 'janisar akhtar',
                phone: '740825'
            },

            movie: {
                _id: movieId,
                title: 'Terminator',
                dailyRentalRate: 2
            },

        });
        await rental.save();
    }); 
    afterEach( async () => { 
        await Rental.deleteMany({});
        await Movie.deleteMany({});
        await server.close(); 
    });

    it('should return 401 if client is not logged in.', async () => { //vid 202
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided.', async () => {
         customerId = '';

         const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided.', async () => {
        movieId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental found for this customer/movie.', async () => {
        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();

        const res = await exec();

        // const res = await request(server)
        // .post('/api/returns')
        // .set('x-auth-token', token)
        // .send({ customerId: customerId, movieId: movieId });

        expect(res.status).toBe(404);
    });

    it('should return 400 if rental already processed.', async () => {
        rental.dateReturned = new Date();
        await rental.save();

        const res = await exec();

        // const res = await request(server)
        // .post('/api/returns')
        // .set('x-auth-token', token)
        // .send({ customerId: customerId, movieId: movieId });

        expect(res.status).toBe(400);
    });

    it('should return 200 if we have a valid request.', async () => {

        const res = await exec();

        // const res = await request(server)
        // .post('/api/returns')
        // .set('x-auth-token', token)
        // .send({ customerId: customerId, movieId: movieId });

        expect(res.status).toBe(200);
    });

    it('should set the returnDate if input is valid.', async () => { //vid208.

        const res = await exec();

        // const res = await request(server)
        // .post('/api/returns')
        // .set('x-auth-token', token)
        // .send({ customerId: customerId, movieId: movieId });

        const rentalInDb = await Rental.findById(rental._id);

        const diff = new Date() - rentalInDb.dateReturned;

        //expect(rentalInDb.dateReturned).toBeDefined(); //too general
        expect(diff).toBeLessThan(10 * 1000); //less than 10 sec.

    });

    it('should set the rentalFee if input is valid.', async () => { //vid209.

        //moment() ->to get current time, add(-7, 'days') ->current time se 7 din('days') pehle set kar rahe hai. and finally toDate() se date ko js date me badal do taki dateOut k atype hi wahi hai->
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);

        expect(rentalInDb.rentalFee).toBe(14);

    });

    it('should increase the stock if input is valid.', async () => { //vid210.

        const res = await exec();

        const movieInDb = await Movie.findById(movieId);

        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);

    });

    it('should return the rental if input is valid.', async () => { //vid211.

        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        // expect(res.body).toMatchObject(rentalInDb); //ye fail ho jaega q ki hum rental me dates js object ki tarah store kr rahe hai per res me jo rental return ho raha hai usme dates json object(string) k form me hai. isliye thoda aur genral expecation likhna hoga ->

        //Object.keys(anyObject) kisi bhi object ki properties ko ek array of strings k form mr change kr deti hai.
        expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie']));

    });

});