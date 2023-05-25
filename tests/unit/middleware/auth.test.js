const auth = require('../../../middleware/auth');
const { User } = require('../../../models/user');
const mongoose = require('mongoose');
//1v vid 194-------------------------------------------------
//hame auth module ko alag se test krna hoga. 
describe('auth middleware', () => {
    it('should populate req.user with the payload of a valid JWT', () => {
        const user = {
            _id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true 
        };
        const token = new User(user).generateAuthToken(); // yaha mew User() me user as a initialization k liye bhej rahe hai.
        const req = {
            header: jest.fn().mockReturnValue(token)
        };
        const res = {}; //yaha hame res ko define to krna hi hoga.
        const next = jest.fn(); //aur next function ko bhi define krna hoga.


        auth(req, res, next);
        expect(req.user).toMatchObject(user);
    });
});

//1^---------------------------------------------------------------