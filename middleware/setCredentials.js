const allowed = require('./allowedOrigins');

const setCredentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowed.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = setCredentials;