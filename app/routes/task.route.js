const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middlewares/authMiddleware');

const {
    getAllTasks,
    getAllTestTasks,
    getTasksWithCriterial,
    editTask,
    createNewTask,
    deleteTask
} = require("../controllers/task.controller");

router.get("/getAllTasks", authenticateJWT, getAllTasks);
router.get("/test-getAllTasks", getAllTestTasks);
router.get("/getTasksWithCriterial", authenticateJWT, getTasksWithCriterial);

router.put("/editTask", authenticateJWT, editTask);
router.post("/createNewTask", authenticateJWT, createNewTask);
router.delete("/deleteTask", authenticateJWT, deleteTask);

module.exports = router;