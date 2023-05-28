//all the middleware that will use for production envoirment, we will add them here. ->

//vid216 ->
const helmet = require('helmet'); //helmet protects your application from well known vulnerablities.
const compression = require('compression'); //we use compression to compress the response we send to client.

const prodMiddleware = function(app) {
    app.use(helmet()); //we have to call helmet in oreder to get a middleware function
    app.use(compression());
}

module.exports = prodMiddleware;