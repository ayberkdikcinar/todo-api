const TodoItem = require('../models/todo_item.model')

async function createItem(item) {
    return await TodoItem.create(item);
}

async function removeItem(id) {
    return await TodoItem.destroy({ where: { id } });
}

async function editItem(data) {
    const { status, content, itemId } = data;
    return await TodoItem.update({ status: status, content: content }, { where: { id: itemId } });
}

async function getItemsByUserId(userId, todoId, isOwner) {
    console.log(isOwner);
    if (isOwner) {
        return await TodoItem.findAll({ where: { todoId: todoId, creator: userId } });
    }
    return await TodoItem.findAll({ where: { todoId: todoId, creator: userId, type: "public" } });
}

async function getItemById(id) {
    return await TodoItem.findOne({ where: { id } });
}

async function getItemsByStatus(status, todoId, userId) {
    let itemsAvailable = [];
    const items = await TodoItem.findAll({ where: { status: status, todoId: todoId } });
    for (const item in items) {
        const response = checkPrivacyOfItem(item, userId);
        if (response) {
            itemsAvailable.push(response);
        }
    }
    return itemsAvailable;
}

function checkPrivacyOfItem(item, userId) {
    if (item.type === "private") {
        if (item.creator !== userId) {
            return false;
        }
        return true;
    }
    return true;

}

module.exports = {
    getItemsByUserId,
    getItemById,
    getItemsByStatus,
    editItem,
    removeItem,
    createItem,
}