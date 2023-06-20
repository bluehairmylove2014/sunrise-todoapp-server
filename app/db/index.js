const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/sunrise-todoapp');
        console.log('connect successfully.');
    } catch (error) {
        console.log('connect failure.' + error);
    }
}

module.exports = { connect };