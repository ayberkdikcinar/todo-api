const express = require('express');
const teamRouter = express.Router();
const TeamController = require('./team.controller')

teamRouter.get('/', TeamController.getAllTeamsByUserId)
teamRouter.post('/create', TeamController.createTeam)
teamRouter.post('/remove', TeamController.removeTeam)
teamRouter.post('/addMember', TeamController.addMemberToTeam)
teamRouter.post('/removeMember', TeamController.removeMemberFromTeam)
teamRouter.get('/:id', TeamController.getTeamById)


module.exports = teamRouter;