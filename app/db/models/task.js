const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    tid: String,
    uid: Number,
    status: String,
    tags: Array,
    task_name: String,
    description: String,
    due_date: String,
    priority: String
});

module.exports = mongoose.model("Task", taskSchema);