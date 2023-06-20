// Import necessary modules
const mongoose = require('mongoose');
const Task = require('../db/models/task'); // Import the Task model

// Function to get all tasks
exports.getAllTasks = async function (req, res) {
    const UID = req.user_id; // Get user id from middleware

    try {
        // Find all tasks that belong to the user
        const tasks = await Task.find({ uid: UID });
        // Send the tasks as a response
        res.status(200).json(tasks);
    } catch (err) {
        // If an error occurs, send an error message
        res.status(500).json({ error: err });
    }
};

// Function to get all tasks by names
exports.getAllTaskByNames = async function (req, res) {
    const UID = req.user_id; // Get user id from middleware
    const task_name = req.query.task_name; // Get task name from request query

    try {
        // Find all tasks that belong to the user and match the task name
        const tasks = await Task.find({ uid: UID, task_name: { $regex: task_name, $options: 'i' } });
        // Send the tasks as a response
        res.status(200).json(tasks);
    } catch (err) {
        // If an error occurs, send an error message
        res.status(500).json({ error: err });
    }
};

// Function to create a new task
exports.createNewTask = async function (req, res) {
    const uid = req.user_id; // Get user id from middleware
    const tdata = req.body.task_data; // Get task data from request body

    try {
        // Create a new task with the user id and task data
        const newTask = new Task({
            uid,
            ...tdata
        });

        // Save the new task to the database
        await newTask.save();
        // Send the new task as a response
        res.status(200).json(newTask);
    } catch (err) {
        // If an error occurs, send an error message
        res.status(500).json({ error: err });
    }
};

// Function to edit a task
exports.editTask = async function (req, res) {
    const uid = req.user_id; // Get user id from middleware
    const tid = req.body.task_id; // Get task id from request body
    const tdata = req.body.task_data; // Get task data from request body
    tdata.uid = uid;

    try {
        // Find the task by tid and update it with the new data

        const task = await Task.findOneAndUpdate({ tid: tid }, tdata, { new: true });
        console.log("Task is: ", task)

        if (!task) {
            // If the task is not found, send a message
            res.status(404).json({ message: 'Task not found' });
        } else {
            // If the task is found and updated, send the updated task as a response
            res.status(200).json(task);
        }

    } catch (err) {
        // If an error occurs, send an error message
        console.log(err)
        res.status(500).json({ error: err });
    }
};

// Function to delete a task
exports.deleteTask = async function (req, res) {
    const tid = req.body.tid; // Get task id from request body
    console.log(tid)

    try {
        // Find the task by id and delete it
        const task = await Task.findOneAndDelete({ tid: tid });

        if (!task) {
            // If the task is not found, send a message
            res.status(404).json({ message: 'Task not found' });
        } else {
            // If the task is found and deleted, send a message
            res.status(200).json({ message: 'Task deleted' });
        }
    } catch (err) {
        // If an error occurs, send an error message
        res.status(500).json({ error: err });
    }
};
