const mongoose = require('mongoose');

const databse = {
    connect: connect,
}

function connect() {
    return mongoose.connect('mongodb://localhost:27017');
}

module.exports = databse;