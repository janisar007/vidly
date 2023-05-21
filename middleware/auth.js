const jwt = require('jsonwebtoken');
const config = require('config');

// this is a middleware. jab bhi user kuch changes karega databse me to sabse pehle uski autherize karna hoga ki kya uske pass permision hai changes karne k liye. means kya uske pass ek valid jwt hai ya nahi.
//to ab jaha jaha bhi db me changes hone ka kaam ho raha hai waha second argument k roop me ye middleware(auth()) function pass krna hoga.
function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access debied. No token provided.');

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    } 
    catch (ex) {
        res.status(400 ).send('Invalid token.');
    }
}

module.exports = auth;