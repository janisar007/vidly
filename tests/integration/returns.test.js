const request = require('supertest');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const mongoose = require('mongoose');

describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
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

        rental = new Rental({
            customer: {
                _id: customerId,
                name: 'janisar akhtar',
                phone: '740825'
            },

            movie: {
                _id: movieId,
                title: 'terminator',
                dailyRentalRate: 2
            },

        });
        await rental.save();
    }); 
    afterEach( async () => { 
        await Rental.deleteMany({});
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

});w