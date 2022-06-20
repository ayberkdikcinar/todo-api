const express = require('express');
const todoItemRouter = express.Router();
const todoItemController = require('./todo_item.controller')

todoItemRouter.post('/create', todoItemController.createItem)
todoItemRouter.post('/remove', todoItemController.removeItem)
todoItemRouter.post('/edit', todoItemController.editItem)
todoItemRouter.get('/user', todoItemController.getItemsByUserId)
module.exports = todoItemRouter;