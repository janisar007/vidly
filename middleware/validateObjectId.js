const mongoose = require('mongoose');

// ye function route k parameter me bheji gayi id ko validate krta hai. vid187,188
const validateObjectId = function(req, res, next) {
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).send('Invalid ID.');

    next();
} 

module.exports = validateObjectId;