const {ObjectId} = require('mongodb');

const mongodb = require('../db/connect');

const getAll = async (req, res, next) => {
const result = await mongodb.getDb().db().collection('tasks').find();
result.toArray().then((lists) => {
res.setHeader('Content-Type', 'application/json');
res.status(200).json(lists);
});
};

const getSingle = async (req, res, next) => {
const taskId = new ObjectId(req.params.id);
const result = await mongodb
.getDb()
.db()
.collection('tasks')
.find({ _id: taskId });
result.toArray().then((lists) => {
res.setHeader('Content-Type', 'application/json');
res.status(200).json(lists[0]);
});
};

const createTask = async (req, res) => {
const task = {
taskName: req.body.taskName,
taskTime: req.body.taskTime,
completed: req.body.completed
};
const response = await mongodb.getDb().db().collection('tasks').insertOne(task);
if( response.acknowledged ) {
res.status(201).json(response);
} else {
res.status(500).json(response.error || 'An error occurred while creating the task')
}
};

const updateTask = async (req, res) => {
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
res.status(500).json(response.error || 'An error occurred while updating the task.');
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