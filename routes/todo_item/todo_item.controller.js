const TodoItem = require('../../services/todo_item.service')
const Todo = require('../../services/todo.service')
const Team = require('../../services/team.service')

async function createItem(req, res) {
    try {

        const todo = await Todo.getTodo(req.body.todoId);
        if (!todo) {
            return res.status(404).json({ 'message': 'Todo not found.' });
        }
        const isUserAuthorized = await Team.checkUserExistanceInTeam(req.user.id, todo.teamId);
        if (!isUserAuthorized) {
            return res.status(401).json({ 'message': 'You can not add item to this Todo' });
        }
        const todoItem = req.body;
        Object.assign(todoItem, { creator: req.user.id })
        return res.json(await TodoItem.createItem(todoItem));
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}

async function removeItem(req, res) {
    try {
        const authorization = await checkAuthorization(req.body.itemId, req.user.id);
        if (authorization != 'true') {
            return res.status(authorization.status).json({ 'message': authorization.message });
        }
        await TodoItem.removeItem(req.body.itemId);
        return res.json({ 'message': 'Item has been removed.' });

    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }

}

async function editItem(req, res) {
    try {

        const authorization = await checkAuthorization(req.body.itemId, req.user.id);
        if (authorization != 'true') {
            return res.status(authorization.status).json({ 'message': authorization.message });
        }
        await TodoItem.editItem(req.body);
        return res.json({ 'message': 'Item has been edited.' });
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}

async function getItemsByUserId(req, res) {
    try {
        let isOwner = false;
        const todo = await Todo.getTodo(req.query.todoId);
        if (!todo) {
            return res.status(404).json({ 'message': 'Todo not found.' });
        }
        const isUserAuthorized = await Team.checkUserExistanceInTeam(req.user.id, todo.teamId);
        if (!isUserAuthorized) {
            return res.status(401).json({ 'message': 'You can not see these items.' });
        }

        if (req.user.id == req.query.userId) {
            isOwner = true;
        }
        return res.json(await TodoItem.getItemsByUserId(req.query.userId, req.query.todoId, isOwner));

    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}

async function checkAuthorization(itemId, userId) {
    try {
        const todoItem = await TodoItem.getItemById(itemId);
        if (!todoItem) {
            return { 'message': 'Item not found', status: 404 };
        }
        const todo = await Todo.getTodo(todoItem.todoId);
        if (!todo) {
            return { 'message': 'Todo not found.', status: 404 };
        }
        const isUserAuthorized = await Team.checkUserExistanceInTeam(userId, todo.teamId);
        if (!isUserAuthorized) {
            return { 'message': 'You do not have permissions.', status: 401 };
        }
        if (todoItem.type === 'private' && userId !== todoItem.creator) {
            return { 'message': 'You do not have permissions.', status: 401 };
        }
        return "true";
    } catch (error) {
        return { 'message': error.message };
    }

}
module.exports = {
    getItemsByUserId,
    editItem,
    removeItem,
    createItem,
}