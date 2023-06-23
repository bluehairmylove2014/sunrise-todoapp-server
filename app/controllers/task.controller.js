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

exports.getAllTestTasks = async function (req, res) {
    const UID = 1; // Default test user id

    try {
        // Find all tasks that belong to the user
        const tasks = await Task.find({ uid: UID });
        // Send the tasks as a response
        res.status(200).json(tasks);
    } catch (err) {
        // If an error occurs, send an error message
        res.status(500).json({ error: err });
    }
}

// Function to create a new task
exports.createNewTask = async function (req, res) {
    const uid = req.user_id; // Get user id from middleware
    const tdata = req.body.task_data; // Get task data from request body

    try {
        // Create a new task with the user id and task data
        const newTask = new Task({
            uid,
            tid: `task@${(await Task.find({})).length + 1}`,
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

// Function to get tasks with filter options
exports.getTasksWithCriterial = async function (req, res) {
    const UID = req.user_id; // Get user id from middleware
    const { priority, status, start_date, end_date, task_name } = req.query; // Get filter options from request query
    try {
        // Create a filter object
        // let filter = { uid: UID };
        let filter = { };

        // Add filter options to the filter object if they exist
        if (priority && priority.trim().length) filter.priority = priority;
        if (status && status.trim().length) filter.status = status;
        if (task_name && task_name.trim().length) filter.task_name = { $regex: task_name, $options: 'i' };
        // Convert start_date and end_date to Date objects
        // If both start_date and end_date exist, add the date range to the filter
        if (start_date && end_date) {
            let startDate = new Date(start_date).toISOString();
            let endDate = new Date(end_date).toISOString();
            filter.$or = [{ due_date: { $gte: startDate, $lte: endDate } }, { due_date: null }];
        }
        // If only start_date exists, add it to the filter
        else if (start_date) {
            let startDate = new Date(start_date).toISOString();
            filter.$or = [{ due_date: { $gte: startDate } }, { due_date: null }];
        }
        // If only end_date exists, add it to the filter
        else if (end_date) {
            let endDate = new Date(end_date).toISOString();
            filter.$or = [{ due_date: { $lte: endDate } }, { due_date: null }];
        }
        // If neither exist, do not add anything to the filter

        // Find all tasks that match the filter
        const tasks = await Task.find(filter);

        // Send the tasks as a response
        res.status(200).json(tasks);
    } catch (err) {
        // If an error occurs, send an error message
        console.log(err)
        res.status(500).json({ error: err });
    }
};

