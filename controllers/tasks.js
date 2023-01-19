const {ObjectId} = require('mongodb');

const mongodb = require('../db/connect');

const { check, validationResult } = require('express-validator');

const getAll = async (req, res, next) => {
  try {
    const result = await mongodb.getDb().db().collection('tasks').find();
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (error) {
    console.error("Error getting all tasks", error);
    res.status(500).json({ message: 'An error occurred while getting all tasks.', error });
  }
};


const getSingle = async (req, res, next) => {
  try {
    const taskId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection('tasks')
      .find({ _id: taskId });
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
    }).catch((err) => {
      console.error("Error getting single task", err);
      res.status(500).json({ message: 'An error occurred while getting a single task.', error: err });
    });
  } catch (error) {
    console.error("Error getting single task", error);
    res.status(500).json({ message: 'An error occurred while getting a single task.', error });
  }
};


const createTask = async (req, res) => {
  try {
    // Validate the request body
    await check('taskName', 'Task name is required').notEmpty().run(req);
    await check('taskTime', 'Task time is required').notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const task = {
      taskName: req.body.taskName,
      taskTime: req.body.taskTime,
      completed: req.body.completed
    };
    const response = await mongodb.getDb().db().collection('tasks').insertOne(task);
    if( response.acknowledged ) {
      res.status(201).json(response);
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    console.error("Error creating the task", error);
    res.status(500).json({ message: 'An error occurred while creating the task.', error });
  }
};

const updateTask = async (req, res) => {
  try {
    // Validate the request body
    await check('taskName', 'Task name is required').notEmpty().run(req);
    await check('taskTime', 'Task time is required').notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    
    const taskId = new ObjectId(req.params.id);
    const task = {
      taskName: req.body.taskName,
      taskTime: req.body.taskTime,
      completed: req.body.completed
    };
    const response = await mongodb.getDb().db().collection('tasks').replaceOne({ _id: taskId }, task);
    if( response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    console.error("Error updating the task", error);
    res.status(500).json({ message: 'An error occurred while updating the task.', error });
  }
};


const deleteTask = async (req, res) => {
try {
const taskId = new ObjectId(req.params.id);
const response = await mongodb.getDb().db().collection('tasks').deleteOne({ _id: taskId });
if (response.deletedCount > 0) {
res.status(200).send();
} else {
res.status(404).json({ message: 'Task not found' });
}
} catch (err) {
res.status(500).json({ message: 'An error occurred while deleting the task.', error: err });
}
};

module.exports = { getAll, getSingle, createTask, updateTask, deleteTask };