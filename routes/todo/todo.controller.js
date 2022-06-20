const Todo = require('../../services/todo.service')
const Team = require('../../services/team.service')

async function getAllTodosByTeamId(req, res) {
    try {
        const team = await Team.getTeamById(req.params.id);
        if (!team) {
            return res.status(404).json({ 'message': 'There is no team found.' });
        }

        const isUserInTeam = await Team.checkUserExistanceInTeam(req.user.id, req.params.id);
        if (isUserInTeam) {
            const todos = await Todo.getAllTodosInTeam(req.params.id);
            if (todos.length > 0) {
                return res.json(todos);
            }
            return res.status(404).json({ 'message': 'There is no todo found.' });
        }
        return res.status(401).json({ 'message': 'User has no authority to see todos.' });

    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}

async function getAllTodoItems(req, res) {
    try {
        if (req.query.type && req.query.todoId) {
            const todo = await Todo.getTodo(req.query.todoId);
            if (!todo) {
                return res.status(404).json({ 'message': 'There is no todo found.' });
            }
            const isUserInTeam = await Team.checkUserExistanceInTeam(req.user.id, todo.teamId)
            if (isUserInTeam) {
                const items = await Todo.getAllTodoItems(req.query.todoId, req.query.type, req.user.id)
                if (items.length > 0) {
                    return res.json(items);
                }
                return res.status(404).json({ 'message': 'There is no item found.' });
            }
            return res.status(401).json({ 'message': 'User has no authority to see todo items.' });
        }
        return res.status(400).json({ 'message': 'type and todoId must be clarified.' })

    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}

async function createTodo(req, res) {
    try {
        if (req.body.teamId && req.body.name) {
            const todo = await Todo.createTodo(req.body, req.user.id);
            return res.json(todo);
        }
        return res.status(400).json({ 'message': 'teamId and name must be clarified.' });


    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}

async function removeTodo(req, res) {
    try {
        const todo = await Todo.getTodo(req.body.todoId);
        if (!todo) {
            return res.status(404).json({ 'message': 'There is no todo found.' });
        }
        if (todo.creator !== req.user.id) {
            return res.status(401).json({ 'message': 'User has no authority to remove todo. Only the owner of todo can remove.' });
        }

        await Todo.removeTodo(req.body.todoId);
        return res.status(200).json({ 'message': 'Todo has been removed.' });

    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}

module.exports = {
    getAllTodosByTeamId,
    getAllTodoItems,
    createTodo,
    removeTodo,
}
