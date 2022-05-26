const path = require('path');
const fsPromises = require('fs').promises;
const bcrypt = require('bcrypt');
const data = require('../model/data.json');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const loginController = async(req, res) => {

    const { userName, password } = req.body;

    if (!userName || !password) {
        return res.status(400).json({ message: "all fields are required" }); //Bad request
    }

    const user = data.users.find(dbUser => dbUser.userName === userName);

    if (!user) {
        return res.status(401).json({ message: `user ${userName} not found` }); //Unauthorized
    }

    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
        return res.status(401).json({ message: "Wrong password" }); //Unauthorized
    }

    const accessToken = jwt.sign({ userName, id: user.id, userRole: user.userRole }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ userName }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

    const updatedData = {...data, users: data.users.map(u => u.userName === userName ? {...u, refreshToken } : u) }

    await fsPromises.writeFile(
        path.join(__dirname, '..', '/model', 'data.json'),
        JSON.stringify(updatedData));

    res.cookie('authCookie', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
    res.json({ userName, accessToken });
}

module.exports = loginController;