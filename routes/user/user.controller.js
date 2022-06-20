const User = require('../../services/user.service')

async function searchUser(req, res) {
    try {
        return res.json(await User.searchUser(req.query.keyword));
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}

async function getAllUsers(req, res) {
    try {
        return res.json(await User.getAllUsers());
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}

async function getUserById(req, res) {
    try {
        const user = await User.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ 'message': 'User not found.' });
        }
        return res.json(await User.getUserById(req.params.id));
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}


module.exports = {
    searchUser,
    getAllUsers,
    getUserById,
}