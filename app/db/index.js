const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://datphan:2014@sunrisetodoapp.jarduyv.mongodb.net/sunrise-todoapp');
        console.log('Connect database successfully.');
    } catch (error) {
        console.log('connect failure.' + error);
    }
}

module.exports = { connect };