// from vid 179 ->
const {User} = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config'); //created a config/test.json to set aur jwtPrivateKey env variable.
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
    it('should return a valid jwt', () => {
        // const user = new User({ _id: 1, isAdmin: true }); //here we have to set _id to a valid id type not 1, 2, 3. so we can do it witj mongoose.
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(), //originally mongoose ids ek object k roop me rahte hai to ise ham toHexString() method se string form me lana hoga.
            isAdmin: true
        };
        const user = new User(payload);

        //first creating the token ->
        const token = user.generateAuthToken();

        //now decoding the token ->
        const decoded = jwt.verify(token, config.get('jwtPrivateKey')); //it will decode the jwt and set it to the payload, or if something failed it will throw error.

        expect(decoded).toMatchObject(payload);
    });
});