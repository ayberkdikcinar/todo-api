const User = require('../models/user.model')
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

async function signIn(data) {
    try {
        const { username } = data;
        return await User.findOne({ where: { username } });

    } catch (error) {
        return error;
    }
};

async function signUp(data) {
    const { email, username, name, password, image_url } = data;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return await User.create({ email, username, name, image_url, password: hashedPassword });
};

async function findUserByUsername(username) {
    return await User.findOne({ where: { username } });
};

async function findUserById(id) {
    return await User.findOne({ where: { id } });
};

async function searchUser(keyword) {
    return await User.findAll({
        where: {
            [Op.or]: [
                {
                    name: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    username: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    email: {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        },
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
};

async function getAllUsers() {
    return await User.findAll({ attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } });
}

async function getUserById(id) {
    return await User.findOne({ where: { id }, attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } });
}

module.exports = {
    signUp,
    signIn,
    findUserByUsername,
    findUserById,
    searchUser,
    getAllUsers,
    getUserById,
}