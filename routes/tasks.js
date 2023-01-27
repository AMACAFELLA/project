const express = require('express');

const router = express.Router();

const { requiresAuth } = require('express-openid-connect');

const tasksController = require('../controllers/tasks');

router.get('/', requiresAuth(), tasksController.getAll);

router.get('/:id', requiresAuth(), tasksController.getSingle);

router.post('/', requiresAuth(), tasksController.createTask);

router.put('/:id', requiresAuth(), tasksController.updateTask);

router.delete('/:id', requiresAuth(), tasksController.deleteTask);

module.exports = router;