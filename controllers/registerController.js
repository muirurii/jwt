const path = require('path');
const fsPromises = require('fs').promises;
const ROLES = require('../model/roles');
const bcrypt = require('bcrypt');
const data = require('../model/data.json');

const registerController = async(req, res) => {

    const { userName, password, email, roleKey } = req.body;

    if (!userName || !password || !email) {
        return res.status(400).json({ message: "all fields are required" });
    }

    const duplicate = data.users.some(user => user.userName === userName);
    const userRole = ROLES[roleKey] || ROLES[5667];

    if (duplicate) {
        return res.status(409).json({ message: "user exists" }); //conflict
    }

    const hashPwd = await bcrypt.hash(password, 14);

    const newUser = { userName, userRole, id: Math.floor(Math.random() * 5000 + 125), password: hashPwd, email }
    const updatedData = {...data, users: [...data.users, newUser] }

    await fsPromises.writeFile(
        path.join(__dirname, '..', '/model', 'data.json'),
        JSON.stringify(updatedData));

    return res.status(201).json({ message: "success" }); //created

}

module.exports = registerController;