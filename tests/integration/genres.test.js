const request = require('supertest'); //iski help se hum get post ..all requests bhej sakte hai.
const { Genre } = require('../../models/genre');
let server;

describe('/api/genres', () => {
    //hame har test se pehle server ko on aur har test k baad off krna hoga nahi to agr test-1 k liye server on ho kar band nahi kiya jaega to next test k liye wo server busy bataega ur error throw ho jaega. iske liye hum beforeEach and afterEach function ka use krte hai->
    beforeEach(() => { server = require('../../index'); }); //beforeEach function me likh code har ek test se pehle run hota hai.
    afterEach( async () => { 
        server.close(); 
        await Genre.deleteMany({}); //hame db empty krna hoga after the end of the test. q ki fir next test fail ho skta hai.
    }); //afterEach me likha code har test k baad run hota hai.

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

        it('should return 404 if invalid id is passed', async () => { 
            const res = await request(server).get('/api/genres/1');
           expect(res.status).toBe(404);
        });
    });
 //1^-------------------------------------------------------------
});