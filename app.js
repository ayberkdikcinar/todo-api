const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const app = express()
require('dotenv').config()
require('./middlewares/auth.passport')

app.use(bodyParser.json());
app.use(express.json());


///Routers
const userRouter = require('./routes/user/user.router');
const teamRouter = require('./routes/team/team.router');
const todoRouter = require('./routes/todo/todo.router');
const todoItemRouter = require('./routes/todo_item/todo_item.router');
const authRouter = require('./routes/auth/auth.router');

app.use('/auth', authRouter);
app.use('/team', passport.authenticate('jwt', { session: false }), teamRouter);
app.use('/todo', passport.authenticate('jwt', { session: false }), todoRouter);
app.use('/todoItem', passport.authenticate('jwt', { session: false }), todoItemRouter);
app.use('/user', passport.authenticate('jwt', { session: false }), userRouter);

module.exports = app;