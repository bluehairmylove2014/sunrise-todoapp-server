const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    id: Number,
    email: String,
    password: String,
    full_name: String,
    age: Number
});

module.exports = mongoose.model("Account", accountSchema);