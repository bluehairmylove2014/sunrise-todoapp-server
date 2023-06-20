

const fs = require('fs');
const path = require('path');

// Đọc dữ liệu từ file db.json
function readJsonData() {
    const rawData = fs.readFileSync(path.join(__dirname, '..', 'db', 'db.json'));
    return JSON.parse(rawData);
}

// Ghi dữ liệu vào file db.json
function writeJsonData(jsonData) {
    fs.writeFileSync(path.join(__dirname, '..', 'db', 'db.json'), JSON.stringify(jsonData, null, 2));
}

exports.getAllTasks = function (req, res) {
    const UID = req.user_id; // Get from middleware

    try {
        const jsonData = readJsonData();
        const tasks = jsonData.tasks.filter(task => task.uid === UID);
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

exports.getAllTaskByNames = function (req, res) {
    const UID = req.user_id; // Get from middleware
    const task_name = req.query.task_name;

    try {
        const jsonData = readJsonData();
        const tasks = jsonData.tasks.filter(task => task.uid === UID && task.task_name.includes(task_name));
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

exports.editTask = function (req, res) {
    const tid = req.body.task_id;
    const tdata = req.body.task_data;

    try {
        const jsonData = readJsonData();
        const taskIndex = jsonData.tasks.findIndex(task => task.id === tid);

        if (taskIndex === -1) {
            res.status(404).json({ message: 'Task not found' });
        } else {
            jsonData.tasks[taskIndex] = { ...jsonData.tasks[taskIndex], ...tdata };
            writeJsonData(jsonData);
            res.status(200).json(jsonData.tasks[taskIndex]);
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

exports.createNewTask = function (req, res) {
    console.log('run create new task')
    const uid = req.user_id;
    const tdata = req.body.task_data;
    console.log('Receive: ')
    console.log('uid: ', uid)
    console.log('task data: ', tdata)

    try {
        const jsonData = readJsonData();
        const newTask = {
            id: `task@${jsonData.tasks.length + 1}`,
            uid,
            ...tdata
        };

        console.log('Your new task: ', newTask)
        jsonData.tasks.push(newTask);
        writeJsonData(jsonData);
        console.log('Add task successfully')
        res.status(200).json(newTask);
    } catch (err) {
        console.log('Error when adding task')
        res.status(500).json({ error: err });
    }
};

exports.deleteTask = function (req, res) {
    const task_id = req.body.tid;

    try {
        const jsonData = readJsonData();
        const taskIndex = jsonData.tasks.findIndex(task => task.id === task_id);

        if (taskIndex === -1) {
            res.status(404).json({ message: 'Task not found' });
        } else {
            jsonData.tasks.splice(taskIndex, 1);
            writeJsonData(jsonData);
            res.status(200).json({ message: 'Task deleted' });
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
};