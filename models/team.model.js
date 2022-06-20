const Sequelize = require('sequelize')
const db = require('../config/database')


const Subscription = db.define('subscription', {
    role: {
        type: Sequelize.STRING
    },
    userId: { type: Sequelize.INTEGER },
    teamId: { type: Sequelize.INTEGER },

}, { timestamps: true });


const Team = db.define('team', {
    name: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    creator: { type: Sequelize.INTEGER },

}, { timestamps: true });

/*await Team.sync();
await Subscription.sync();*/

module.exports = { Team, Subscription };
