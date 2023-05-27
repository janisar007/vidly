// //1v vid 193------------------------------
// //auth middleware bhut se route k pehle laga hai to hame auth ki saari functionallity har rout me check krne ki jarorar nahi hai. Auth k functions ko yaha test kr lenge aur. aur jis route me auth laga hoga waha bas ye check krne ki jaroorar hai ki auth middleware route se pehle call ho raha hai na.

//testing functionallity of routes ->
// Note: vid192 me tests ko aut better structure krna bataya gaya hai(lekin us vid ko  maine kiya nahi hai). per us vid k techneques ko direct use kr rahe hai yaha ->
const { User } = require('../../models/user');
const { Genre } = require('../../models/genre');
const request = require('supertest'); //is npm packet se hame sirf response k ahi access milta hai req ka nahi.
let server;

// describe('auth middleware', () => {
//     beforeEach(() => { server = require('../../index'); }); //beforeEach function me likh code har ek test se pehle run hota hai.
//     afterEach( async () => { 
//         await server.close();
//         await Genre.deleteMany({}); //last test me ek genre create ho raha hi is liye use hatan ahoga last me.
//     });
//     // afterEach( () => { 
//     //     server.close();
//     // });

//     let token;
//     const exec = () => {
//        return request(server)
//         .post('/api/genres')
//         .set('x-auth-token', token)
//         .send({ name: 'genre1' });
//     }

//     beforeEach(() => {
//         token = new User().generateAuthToken();
//     });

//     it('should return 401 if no token is provided', async () => {
//         token = '';

//         const res = await exec();
        
//         expect(res.status).toBe(401);
//     });

//     it('should return 400 if token is invalid', async () => {
//         token = 'a';

//         const res = await exec();
        
//         expect(res.status).toBe(400);
//     });

//     it('should return 200 if token is valid', async () => {
//         // token is already set from the seconf afterEach function.

//         const res = await exec();
        
//         expect(res.status).toBe(200);
//     });
//     //1^---------------------------------------------------

//     // NOTE: auth middleware k liye sirf ek test bacha hua hai jisme hum req se deal kar rahe hai(try block wala). lekin supertest npm se hum sirf res ko hi access kar sakte hai, req ko nahi. is liye hame iske liye unit test likna hoga. jo ki tests/unit/middleware/auth.test me likh hai. see vid 194

// });

describe('psudo test', () => {
    it('running psudo test', () => {

    });
});