const express = require('express');
const todoRouter = express.Router();
const todoController = require('./todo.controller')

todoRouter.get('/items', todoController.getAllTodoItems)
todoRouter.post('/', todoController.createTodo)
todoRouter.get('/:id', todoController.getAllTodosByTeamId)
todoRouter.post('/remove', todoController.removeTodo)

module.exports = todoRouter;
