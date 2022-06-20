const Todo = require('../models/todo.model')

async function getAllTodosInTeam(teamId) {
    return await Todo.findAll({ where: { teamId } });
}

async function getTodo(id) {
    return await Todo.findOne({ where: { id: id } });
}

async function getAllTodoItems(todoId, type, userId) {

    const todo = await Todo.findOne({ where: { id: todoId } });

    if (type === "private") {
        console.log(await todo.getTodoItems({ where: { type: type, creator: userId } }));
        return await todo.getTodoItems({ where: { type: type, creator: userId } });
    }
    return await todo.getTodoItems({ where: { type: type } });
}

async function createTodo(data, userId) {
    const newTodo = { creator: userId, name: data.name, teamId: data.teamId };
    console.log(userId)
    return await Todo.create(newTodo);
}

async function removeTodo(todoId) {
    return await Todo.destroy({ where: { id: todoId } });
}

module.exports = {
    createTodo,
    getTodo,
    removeTodo,
    getAllTodosInTeam,
    getAllTodoItems,
}