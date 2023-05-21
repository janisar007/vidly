

//here i am saying ki only admin user hi genres ko delete kar sake. is liye models/user.js me ek new property named isAdmin banaya hai aur genres.js k delete route me ek aur middleware function admin pass kiya hai. Note: isAmin property ko direct mngodbcompass se set kar len aq ki is property ko server per set karne k liye code nahi likha hai. (lec 140, 141)
function admin(req, res, next) {
    //from the auth middleware-
    if(!req.user.isAdmin) return res.status(403).send('Access denied.');

    next(); //to the route handler->
}

module.exports = admin;

