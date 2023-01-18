const express = require('express');
const router = express.Router();

const tasksController = require('../controllers/tasks');

router.get('/', tasksController.getAll);

router.get('/:id', tasksController.getSingle);

router.post('/', tasksController.createTasks);

router.put('/:id', tasksController.updateTasks);

router.delete('/:id', tasksController.deleteTasks);

module.exports = router;