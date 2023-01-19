const express = require('express');

const router = express.Router();

const tasksController = require('../controllers/tasks');

router.get('/', tasksController.getAll);

router.get('/:id', tasksController.getSingle);

router.post('/', tasksController.createTask);

router.put('/:id', tasksController.updateTask);

router.delete('/:id', tasksController.deleteTask);

module.exports = router;