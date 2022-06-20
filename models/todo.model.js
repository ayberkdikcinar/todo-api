const Sequelize = require('sequelize')
const db = require('../config/database')

const Todo = db.define('todo', {
    name: {
        type: Sequelize.STRING
    },
    creator: { type: Sequelize.INTEGER },

}, { timestamps: true });

module.exports = Todo;

