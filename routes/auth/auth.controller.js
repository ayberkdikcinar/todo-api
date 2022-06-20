const User = require('../../services/user.service')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");

async function signIn(req, res) {
    try {
        const userWithUsername = await User.signIn(req.body);
        if (!userWithUsername) {
            return res.status(400).json({ 'message': 'Username or password does not match.' });
        }
        const validPassword = await bcrypt.compare(req.body.password, userWithUsername.password);

        if (!validPassword) {
            return res.status(400).json({ 'message': 'Username or password does not match.' });
        }

        const jwtToken = jwt.sign({ id: userWithUsername.id, username: userWithUsername.username }, process.env.JWT_SECRET);

        let userWithoutPassword = JSON.parse(JSON.stringify(userWithUsername));
        delete userWithoutPassword.password;

        return res.json({
            user: userWithoutPassword,
            token: jwtToken
        });

    } catch (error) {
        return res.status(500).json(error);
    }
}

async function signUp(req, res) {
    try {
        const userAlreadyExist = await User.findUserByUsername(req.body.username);
        if (userAlreadyExist) {
            return res.status(400).json({ 'message': 'user already exist.' });
        }
        const newUser = await User.signUp(req.body);
        return res.status(201).json(newUser);

    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = {
    signIn,
    signUp,
}