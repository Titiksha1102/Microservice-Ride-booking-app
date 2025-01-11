const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/captain-service');
module.exports = mongoose;