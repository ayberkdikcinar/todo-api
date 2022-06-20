const express = require('express');
const userRouter = express.Router();
const userController = require('./user.controller')

userRouter.get('/', userController.getAllUsers)
userRouter.get('/search', userController.searchUser)
userRouter.get('/:id', userController.getUserById)

module.exports = userRouter;