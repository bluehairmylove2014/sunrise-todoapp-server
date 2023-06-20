const mongoose = require('mongoose');
const Task = require('../db/models/task'); // Import the Task model

// Get all tasks
exports.getAllTasks = async function (req, res) {
    const UID = req.user_id; // Get from middleware

    try {
        const tasks = await Task.find({ uid: UID });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

// Get all tasks by names
exports.getAllTaskByNames = async function (req, res) {
    const UID = req.user_id; // Get from middleware
    const task_name = req.query.task_name;

    try {
        const tasks = await Task.find({ uid: UID, task_name: { $regex: task_name, $options: 'i' } });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

// Edit task
exports.editTask = async function (req, res) {
    const tid = req.body.task_id;
    const tdata = req.body.task_data;

    try {
        const task = await Task.findByIdAndUpdate(tid, tdata, { new: true });

        if (!task) {
            res.status(404).json({ message: 'Task not found' });
        } else {
            res.status(200).json(task);
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

// Create new task
exports.createNewTask = async function (req, res) {
    const uid = req.user_id;
    const tdata = req.body.task_data;
    console.log('Receive: ')
    console.log('uid: ', uid)
    console.log('task data: ', tdata)

    try {
        const newTask = new Task({
            uid,
            ...tdata
        });

        await newTask.save();
        res.status(200).json(newTask);
    } catch (err) {
        console.log('Error when adding task')
        res.status(500).json({ error: err });
    }
};

// Delete task
exports.deleteTask = async function (req, res) {
    const tid = req.body.task_id; // Get task id from request body

    try {
        const task = await Task.findByIdAndDelete(tid); // Find and delete task by id

        if (!task) {
            res.status(404).json({ message: 'Task not found' }); // If task not found, return 404
        } else {
            res.status(200).json({ message: 'Task deleted' }); // If task found and deleted, return 200
        }
    } catch (err) {
        res.status(500).json({ error: err }); // If error occurred, return 500
    }
};
