const Sequelize = require('sequelize')
const db = require('../config/database')
const { Team, Subscription } = require('./team.model')
const Todo = require('./todo.model')
const TodoItem = require('./todo_item.model')



const User = db.define('user', {
    name: {
        type: Sequelize.STRING
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    }
    ,
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
    ,
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    image_url: {
        type: Sequelize.STRING
    }
}, { timestamps: true });


//relations

User.hasMany(Team, { foreignKey: "creator" });
Team.belongsTo(User, { foreignKey: "creator" });

User.hasMany(Subscription, { foreignKey: "userId" });
Subscription.belongsTo(User, { foreignKey: "userId" });

Todo.belongsTo(User, { foreignKey: "creator" });
User.hasMany(Todo, { foreignKey: "creator" });

User.hasMany(TodoItem, { foreignKey: "creator" });
TodoItem.belongsTo(User, { foreignKey: "creator" });

Team.hasMany(Subscription, { foreignKey: "teamId" });
Subscription.belongsTo(Team, { foreignKey: "teamId" });

Todo.belongsTo(Team, { foreignKey: "teamId" });
Team.hasMany(Todo, { foreignKey: "teamId" });

Todo.hasMany(TodoItem, { foreignKey: "todoId" });
TodoItem.belongsTo(Todo, { foreignKey: "todoId" });

//User.belongsToMany(Team, { foreignKey: "userId", through: "Subscription" });
//Team.belongsToMany(User, { foreignKey: "teamId", through: "Subscription" })

module.exports = User;