const { Team, Subscription } = require('../models/team.model');

async function createTeam(creator, data) {

    const { name, description } = data;
    const newTeam = await Team.create({ creator, name, description });
    const newSubscription = await Subscription.create({ userId: creator, role: 'admin', teamId: newTeam.dataValues.id });
    if (!newTeam && !newSubscription) {
        return null;
    }
    return newTeam;
}

async function removeTeam(teamId) {
    return await Team.destroy({ where: { id: teamId } });
}

async function getTeamById(teamId) {
    return await Team.findOne({
        where: {
            id: teamId,
        },
        include: {
            model: Subscription
        }
    });
}

async function addMember(data) {
    const { userId, teamId, role } = data;
    return await Subscription.create({
        userId: userId,
        teamId: teamId,
        role: role
    });
}

async function removeMember(userId, teamId) {
    return await Subscription.destroy({
        where: {
            teamId: teamId,
            userId: userId,
        }
    });
}

async function getMembers(teamId) {
    const team = await Team.findOne({
        where: {
            id: teamId,
        },
    });
    return await team.getMembers();
}

async function getAllTeamsByUserId(userId) {
    const userTeams = [];
    const subs = await Subscription.findAll({ where: { userId } });
    for (let i = 0; i < subs.length; i++) {
        userTeams.push(await subs[i].getTeam());
    }
    return userTeams;
}

async function checkUserExistanceInTeam(userId, teamId) {
    const subscription = await Subscription.findAll({ where: { userId, teamId } });
    if (subscription.length > 0) {
        return true;
    }
    return false;
}

module.exports = {
    addMember,
    removeMember,
    createTeam,
    removeTeam,
    getAllTeamsByUserId,
    getTeamById,
    getMembers,
    checkUserExistanceInTeam,
}