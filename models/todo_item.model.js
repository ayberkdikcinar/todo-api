const Sequelize = require('sequelize')
const db = require('../config/database')

const TodoItem = db.define('todoItem', {
    status: {
        type: Sequelize.STRING,
        defaultValue: "active"
    },
    content: {
        type: Sequelize.STRING
    },
    type: {
        type: Sequelize.STRING,
        defaultValue: "public"
    },
    creator: { type: Sequelize.INTEGER },
    todoId: { type: Sequelize.INTEGER },

}, { timestamps: true });


module.exports = TodoItem;