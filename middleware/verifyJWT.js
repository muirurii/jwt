const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {

    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader) {
        return res.sendStatus(403);
    }

    const bearerToken = bearerHeader.split(" ")[1];

    req.token = bearerToken;

    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
        if (err) {
            return res.sendStatus(403);
        } else {
            req.userInfo = { id: authData.id, userName: authData.userName, userRole: authData.userRole }
            next();
        }
    });

};

module.exports = verifyJWT;