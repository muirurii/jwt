const data = require('../model/data.json');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const refreshController = (req, res) => {

    const cookies = req.cookies;

    if (!cookies || !cookies.authCookie) {
        return res.sendStatus(400);
    }

    const refreshToken = cookies.authCookie;

    const user = data.users.find(dbUser => dbUser.refreshToken === refreshToken);

    if (!user) {
        return res.sendStatus(403); //Forbiden
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || decoded.userName !== user.userName) {
                return res.sendStatus(403)
            }

            const accessToken = jwt.sign({ 'userName': user.userName },
                process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' }
            );

            res.json({ userName: decoded.userName, accessToken });
        }
    );

}

module.exports = refreshController;