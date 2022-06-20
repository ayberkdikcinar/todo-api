const Team = require('../../services/team.service')
const User = require('../../services/user.service')
async function getAllTeamsByUserId(req, res) {
    try {
        return res.json(await Team.getAllTeamsByUserId(req.user.id));
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}

async function getTeamById(req, res) {
    try {
        const response = await Team.getTeamById(req.params.id);
        if (response) {
            return res.json(response);
        }
        return res.status(404).json({ 'message': 'Team does not exist.' })
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}

async function createTeam(req, res) {
    try {
        const newTeam = await Team.createTeam(req.user.id, req.body);
        if (!newTeam) {
            return res.status(500).json({ 'message': 'Team could not be created.' })
        }
        return res.status(201).json(newTeam);
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}

async function removeTeam(req, res) {
    try {
        const id = req.body.teamId;
        const team = await Team.getTeamById(id);
        if (team) {
            if (team.creator === req.user.id) {
                await Team.removeTeam(id);
                return res.json({ 'message': 'Team has been removed.' });

            }
            return res.status(404).json({ 'message': 'To remove team, you must be the owner of the team.' });
        }

        return res.status(404).json({ 'message': 'Team does not exist.' });


    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}

async function addMemberToTeam(req, res) {
    try {

        if (req.body.userId && req.body.teamId) {
            const { userId, teamId } = req.body;
            const user = await User.findUserById(userId);
            if (!user) {
                return res.status(404).json({ 'message': 'User does not exist.' });
            }
            const team = await Team.getTeamById(teamId);
            if (team) {
                if (team.creator === req.user.id) {

                    for (let i = 0; i < team.subscriptions.length; i++) {

                        if (team.subscriptions[i].userId === userId) {
                            return res.status(400).json({ 'message': 'User already exist in the team.' });
                        }
                    }
                    const response = await Team.addMember(req.body);
                    return res.status(201).json(response);
                }
                return res.status(401).json({ 'message': 'To add user, you must be the owner of the team' });
            }
            return res.status(404).json({ 'message': 'Team does not exist.' });

        }
        return res.status(400).json({ 'message': 'userId and teamId must be clarified.' })

    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }

}

async function removeMemberFromTeam(req, res) {
    try {
        if (req.body.userId && req.body.teamId) {
            const { userId, teamId } = req.body;
            const team = await Team.getTeamById(teamId);
            if (team.creator === req.user.id) {
                if (req.user.id === userId) {
                    return res.status(400).json({ 'message': 'You are the admin. You can not remove yourself.' });
                }
                const response = await Team.removeMember(userId, teamId);
                if (response == 0) {
                    return res.status(404).json({ 'message': 'User does not exist in the team.' });
                }
                return res.json({ 'message': 'Member has been deleted.' });
            }
            return res.status(404).json({ 'message': 'You are not the admin. You can not remove members.' });

        }
        return res.status(400).json({ 'message': 'userId and teamId must be clarified.' })

    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }

}

module.exports = {
    getAllTeamsByUserId,
    getTeamById,
    addMemberToTeam,
    removeMemberFromTeam,
    createTeam,
    removeTeam,
}