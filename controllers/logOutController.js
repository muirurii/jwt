const path = require('path');
const fsPromises = require('fs').promises;
const data = require('../model/data.json');

const logOutController = async(req, res) => {

    const cookies = req.cookies;

    if (!cookies || !cookies.authCookie) {
        return res.sendStatus(204); // Succesfull but no content
    }

    const authCookie = cookies.authCookie;

    const user = data.users.find(dbUser => dbUser.refreshToken === cookies.authCookie);

    if (!user) {
        res.clearCookie('authCookie', authCookie, { httpOnly: true, secure: true, sameSite: 'None' });
        return res.sendStatus(204);
    }

    const updatedData = {...data, users: data.users.map(u => u.refreshToken === authCookie ? {...u, refreshToken: undefined } : u) }

    await fsPromises.writeFile(
        path.join(__dirname, '..', '/model', 'data.json'),
        JSON.stringify(updatedData));

    res.clearCookie('authCookie', authCookie, { httpOnly: true, secure: true, sameSite: 'None' });
    res.sendStatus(204);
}

module.exports = logOutController;