const request = require('supertest'); //iski help se hum get post ..all requests bhej sakte hai.
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {
    //hame har test se pehle server ko on aur har test k baad off krna hoga nahi to agr test-1 k liye server on ho kar band nahi kiya jaega to next test k liye wo server busy bataega ur error throw ho jaega. iske liye hum beforeEach and afterEach function ka use krte hai->
    beforeEach(() => { server = require('../../index'); }); //beforeEach function me likh code har ek test se pehle run hota hai.
    afterEach( async () => { 
        await Genre.deleteMany({}); //hame db empty krna hoga after the end of the test. q ki fir next test fail ho skta hai.
        await server.close(); 
    }); //afterEach me likha code har test k baad run hota hai.
    
    // afterEach( async () => { //server.close() ko async me mat dhalo nahi to server der me close hoga aur next test k liye server busy bataega. (from vid 194)
    //     await server.close(); 
    // });
    
    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([ //mongoose k insertMany function se hum apne databse me ek saath kai objects insert kar sakte hai.
                { name: 'genre1' },
                { name: 'genre2' }
            ]);


            const res = await request(server).get('/api/genres'); //yaha jo get ho raha hai wo supertest npm se aya hai.
            expect(res.status).toBe(200); //lekin ye test too general hai. isse ye to pata chal raha hai ki get request mast chal raha hai per ye nahi pata chal raha ki get request se actual me genre objects aa rahe hai wo bhi bilkul sahi databse se.

            expect(res.body.length).toBe(2); //this is too genral aswell.

            //here res.body is an array and some() is method in arrays to check the exsistence of any element->
            expect(res.body.some((g) => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some((g) => g.name === 'genre2')).toBeTruthy();
        });

        
    });

    //1v vid 186,187,88-----------------------------------
    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            // await Genre.collection.insertMany([
            //     { name: 'genre1' },
            //     { name: 'genre2' }
            // ]);
            const genre = new Genre({ name: 'genre1' });//_id is created right here
            await genre.save(); 

            const res = await request(server).get('/api/genres/' + genre._id);
           expect(res.status).toBe(200);

        // expect(res.body).toMatchObject(genre); // ab chu ki mongoose id ko ek lenghty object k roop me save krta hai is liye test fail ho jaega q ki genre._id to hum string hi expect kr rahe honge. so->
        expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid id is passed', async () => { //this is when validateObjectId middleware acted.
            const res = await request(server).get('/api/genres/1');
           expect(res.status).toBe(404);
        });

        //3v vid195----------------------------------------
        it('should return 404 if no genre with the given id exists', async () => { //see vid 195
            const id = new mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/' + id);
           expect(res.status).toBe(404);
        });
        //3^----------------------------------------------
    });
 //1^-------------------------------------------------------------
 
 //2v vid 189,190,191---------------------------------------
    describe('POST /', () => {
        it('should return a 401 if client is not logged in',async () => {
            const res = await request(server).post('/api/genres').send({ name: 'genre1' });

            expect(res.status).toBe(401); //q ki abhi user post krne k liye autherized nahi hai, uske paas token nahi hai.
        });

        it('should return a 400 genre is less than 5 character', async () => {
            const token = new User().generateAuthToken();

            const res = await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: '1234' });

            expect(res.status).toBe(400);
        });

        it('should return a 400 genre is more than 50 character', async () => {
            const token = new User().generateAuthToken();

            const name = new Array(52).join('a'); //this will return an 51 characterd string.

            const res = await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: name });

            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            const token = new User().generateAuthToken();

            const res = await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });

            const genre = await Genre.find({ name: 'genre1' });

            expect(genre).not.toBeNull();
        });
        
        it('should return the genre if it is valid', async () => {
            const token = new User().generateAuthToken();
            

            const res = await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
    //2^--------------------------------------------------------

    describe('PUT /:id', () => {
        it('should return 401 if client is not logged in', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server)
            .put('/api/genres/' + genre._id)
            .send({ name: 'newGenre' });

            expect(res.status).toBe(401);
        });
        
        it('should return a 400 genre is less than 5 character', async () => {
            const token = new User().generateAuthToken();
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server)
            .put('/api/genres/' + genre._id)
            .set('x-auth-token', token)
            .send({ name: '1234' });

            expect(res.status).toBe(400);
        });

        it('should return a 400 genre is more than 50 character', async () => {
            const token = new User().generateAuthToken();
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const name = new Array(52).join('a'); //this will return an 51 characterd string.

            const res = await request(server)
            .put('/api/genres/' + genre._id)
            .set('x-auth-token', token)
            .send({ name: name });

            expect(res.status).toBe(400);
        });
        
        it('should update the genre if it is valid', async () => {
            const token = new User().generateAuthToken();
            let genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server)
            .put('/api/genres/' + genre._id)
            .set('x-auth-token', token)
            .send({ name: 'newGenre' });

            genre = await Genre.find({ name: 'newGenre' });

            expect(genre).not.toBeNull();
        });
        
        it('should return 404 if no such genre is present with given id', async () => {
            const id = new mongoose.Types.ObjectId();
            const token = new User().generateAuthToken();
            let genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server)
            .put('/api/genres/' + id)
            .set('x-auth-token', token)
            .send({ name: 'newGenre' });

            expect(res.status).toBe(404);
        });
        
        it('should return the new genre if it is valid', async () => {
            const token = new User().generateAuthToken();
            const genre = new Genre({ name: 'genre1' });
            await genre.save();            

            const res = await request(server)
            .put('/api/genres/' + genre._id)
            .set('x-auth-token', token)
            .send({ name: 'newGenre' });

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'newGenre');
        });
    });

    describe('DELETE /:id', () => {
        it('should return 401 if client is not logged in', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server)
            .delete('/api/genres/' + genre._id)
            .send();

            expect(res.status).toBe(401);
        });

        it('should return 403 if client is not admin', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const user = { isAdmin: false };
            const token = new User(user).generateAuthToken();

            const res = await request(server)
            .delete('/api/genres/' + genre._id)
            .set('x-auth-token', token)
            .send();

            expect(res.status).toBe(403);
        });

        it('should return 404 if no such genre is present with given id', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const id = new mongoose.Types.ObjectId();

            const user = { isAdmin: true };
            const token = new User(user).generateAuthToken();

            const res = await request(server)
            .delete('/api/genres/' + id)
            .set('x-auth-token', token)
            .send();

            expect(res.status).toBe(404);
        });

        it('should delete the the genre with given id', async () => {
            let genre = new Genre({ name: 'genre1' });
            await genre.save();

            const user = { isAdmin: true };
            const token = new User(user).generateAuthToken();

            const res = await request(server)
            .delete('/api/genres/' + genre._id)
            .set('x-auth-token', token)
            .send();

            genre = await Genre.find({ name: 'genre1' }); //it will give an empty array [].

        
            expect(genre).toHaveLength(0);
        });

        it('should return the deleted genre with given id', async () => {
            let genre = new Genre({ name: 'genre1' });
            await genre.save();

            const user = { isAdmin: true };
            const token = new User(user).generateAuthToken();

            const res = await request(server)
            .delete('/api/genres/' + genre._id)
            .set('x-auth-token', token)
            .send();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
});










    // beforeEach(() => { server = require('../../index'); }); 
    // afterEach( async () => { 
    //     server.close(); 
    //     await Genre.deleteMany({});
    // });
    
    // afterEach(() => { //server.close() ko async me mat dhalo nahi to server der me close hoga aur next test k liye server busy bataega. (from vid 194)
    //     server.close(); 
    // });
    
//     describe('GET /', () => {
//         beforeEach(() => { server = require('../../index'); }); 
//     afterEach( async () => { 
//          await server.close(); 
//         await Genre.deleteMany({});
//     });

//         it('should return all genres', async () => {
//             await Genre.collection.insertMany([
//                 { name: 'genre1' },
//                 { name: 'genre2' }
//             ]);


//             const res = await request(server).get('/api/genres'); 
//             expect(res.status).toBe(200);

//             expect(res.body.length).toBe(2); 
  
//             expect(res.body.some((g) => g.name === 'genre1')).toBeTruthy();
//             expect(res.body.some((g) => g.name === 'genre2')).toBeTruthy();
//         });

        
//     });

//     //1v vid 186,187,88-----------------------------------
//     describe('GET /:id', () => {
//         beforeEach(() => { server = require('../../index'); }); 
//     afterEach( async () => { 
//         await server.close(); 
//         await Genre.deleteMany({});
//     });
//         it('should return a genre if valid id is passed', async () => {

//             const genre = new Genre({ name: 'genre1' });
//             await genre.save(); 

//             const res = await request(server).get('/api/genres/' + genre._id);
//            expect(res.status).toBe(200);

        
//         expect(res.body).toHaveProperty('name', genre.name);
//         });

//         it('should return 404 if invalid id is passed', async () => { 
//             const res = await request(server).get('/api/genres/1');
//            expect(res.status).toBe(404);
//         });

//         //3v vid195----------------------------------------
//         it('should return 404 if no genre with the given id exists', async () => { //see vid 195
//             const id = new mongoose.Types.ObjectId();
//             const res = await request(server).get('/api/genres/' + id);
//            expect(res.status).toBe(404);
//         });
//         //3^----------------------------------------------
//     });
//  //1^-------------------------------------------------------------
 
//  //2v vid 189,190,191---------------------------------------
//     describe('POST /', () => {
//         beforeEach(() => { server = require('../../index'); }); 
//     afterEach( async () => { 
//         await server.close(); 
//         await Genre.deleteMany({});
//     });
//         it('should return a 401 if client is not logged in',async () => {
//             const res = await request(server).post('/api/genres').send({ name: 'genre1' });

//             expect(res.status).toBe(401);
//         });

//         it('should return a 400 genre is less than 5 character', async () => {
//             const token = new User().generateAuthToken();

//             const res = await request(server)
//             .post('/api/genres')
//             .set('x-auth-token', token)
//             .send({ name: '1234' });

//             expect(res.status).toBe(400);
//         });

//         it('should return a 400 genre is more than 50 character', async () => {
//             const token = new User().generateAuthToken();

//             const name = new Array(52).join('a'); 
//             const res = await request(server)
//             .post('/api/genres')
//             .set('x-auth-token', token)
//             .send({ name: name });

//             expect(res.status).toBe(400);
//         });

//         it('should save the genre if it is valid', async () => {
//             const token = new User().generateAuthToken();

//             const res = await request(server)
//             .post('/api/genres')
//             .set('x-auth-token', token)
//             .send({ name: 'genre1' });

//             const genre = await Genre.find({ name: 'genre1' });

//             expect(genre).not.toBeNull();
//         });
        
//         it('should return the genre if it is valid', async () => {
//             const token = new User().generateAuthToken();
            

//             const res = await request(server)
//             .post('/api/genres')
//             .set('x-auth-token', token)
//             .send({ name: 'genre1' });

//             expect(res.body).toHaveProperty('_id');
//             expect(res.body).toHaveProperty('name', 'genre1');
//         });
//     });
//     //2^--------------------------------------------------------

//     describe('PUT /:id', () => {
//         beforeEach(() => { server = require('../../index'); }); 
//     afterEach( async () => { 
//         await server.close(); 
//         await Genre.deleteMany({});
//     });
//         it('should return 401 if client is not logged in', async () => {
//             const genre = new Genre({ name: 'genre1' });
//             await genre.save();

//             const res = await request(server)
//             .put('/api/genres/' + genre._id)
//             .send({ name: 'newGenre' });

//             expect(res.status).toBe(401);
//         });
        
//         it('should return a 400 genre is less than 5 character', async () => {
//             const token = new User().generateAuthToken();
//             const genre = new Genre({ name: 'genre1' });
//             await genre.save();

//             const res = await request(server)
//             .put('/api/genres/' + genre._id)
//             .set('x-auth-token', token)
//             .send({ name: '1234' });

//             expect(res.status).toBe(400);
//         });

//         it('should return a 400 genre is more than 50 character', async () => {
//             const token = new User().generateAuthToken();
//             const genre = new Genre({ name: 'genre1' });
//             await genre.save();

//             const name = new Array(52).join('a'); //this will return an 51 characterd string.

//             const res = await request(server)
//             .put('/api/genres/' + genre._id)
//             .set('x-auth-token', token)
//             .send({ name: name });

//             expect(res.status).toBe(400);
//         });
        
//         it('should update the genre if it is valid', async () => {
//             const token = new User().generateAuthToken();
//             let genre = new Genre({ name: 'genre1' });
//             await genre.save();

//             const res = await request(server)
//             .put('/api/genres/' + genre._id)
//             .set('x-auth-token', token)
//             .send({ name: 'newGenre' });

//             genre = await Genre.find({ name: 'newGenre' });

//             expect(genre).not.toBeNull();
//         });
        
//         it('should return 404 if no such genre is present with given id', async () => {
//             const id = new mongoose.Types.ObjectId();
//             const token = new User().generateAuthToken();
//             let genre = new Genre({ name: 'genre1' });
//             await genre.save();

//             const res = await request(server)
//             .put('/api/genres/' + id)
//             .set('x-auth-token', token)
//             .send({ name: 'newGenre' });

//             expect(res.status).toBe(404);
//         });
        
//         it('should return the new genre if it is valid', async () => {
//             const token = new User().generateAuthToken();
//             const genre = new Genre({ name: 'genre1' });
//             await genre.save();            

//             const res = await request(server)
//             .put('/api/genres/' + genre._id)
//             .set('x-auth-token', token)
//             .send({ name: 'newGenre' });

//             expect(res.body).toHaveProperty('_id');
//             expect(res.body).toHaveProperty('name', 'newGenre');
//         });
//     });

//     describe('DELETE /:id', () => {
//         beforeEach(() => { server = require('../../index'); }); 
//     afterEach( async () => { 
//         await server.close(); 
//         await Genre.deleteMany({});
//     });
//         it('should return 401 if client is not logged in', async () => {
//             const genre = new Genre({ name: 'genre1' });
//             await genre.save();

//             const res = await request(server)
//             .delete('/api/genres/' + genre._id)
//             .send();

//             expect(res.status).toBe(401);
//         });

//         it('should return 403 if client is not admin', async () => {
//             const genre = new Genre({ name: 'genre1' });
//             await genre.save();

//             const user = { isAdmin: false };
//             const token = new User(user).generateAuthToken();

//             const res = await request(server)
//             .delete('/api/genres/' + genre._id)
//             .set('x-auth-token', token)
//             .send();

//             expect(res.status).toBe(403);
//         });

//         it('should return 404 if no such genre is present with given id', async () => {
//             const genre = new Genre({ name: 'genre1' });
//             await genre.save();

//             const id = new mongoose.Types.ObjectId();

//             const user = { isAdmin: true };
//             const token = new User(user).generateAuthToken();

//             const res = await request(server)
//             .delete('/api/genres/' + id)
//             .set('x-auth-token', token)
//             .send();

//             expect(res.status).toBe(404);
//         });

//         it('should delete the the genre with given id', async () => {
//             let genre = new Genre({ name: 'genre1' });
//             await genre.save();

//             const user = { isAdmin: true };
//             const token = new User(user).generateAuthToken();

//             const res = await request(server)
//             .delete('/api/genres/' + genre._id)
//             .set('x-auth-token', token)
//             .send();

//             genre = await Genre.find({ name: 'genre1' }); //it will give an empty array [].

        
//             expect(genre).toHaveLength(0);
//         });

//         it('should return the deleted genre with given id', async () => {
//             let genre = new Genre({ name: 'genre1' });
//             await genre.save();

//             const user = { isAdmin: true };
//             const token = new User(user).generateAuthToken();

//             const res = await request(server)
//             .delete('/api/genres/' + genre._id)
//             .set('x-auth-token', token)
//             .send();

//             expect(res.body).toHaveProperty('_id');
//             expect(res.body).toHaveProperty('name', 'genre1');
//         });
//     });