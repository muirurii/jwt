const express = require("express");
const cors = require("cors");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const PORT = process.env.PORT || 5000;


const allowed = ['http://127.0.0.1:5000', 'http://127.0.0.1:8022', 'http://www.google.com'];
const corsOptions = {
    origin: (origin, callback) => {
        if (allowed.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('CORS error'));
        }
    },
    optionsSuccessStatus: 200
}

app.use(cors());

app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));


app.use(verifyJWT);

app.use("/posts", require("./routes/posts"));

app.use(function(err, req, res, next) {
    res.status(500).send(err.message);
    next();
});

app.listen(PORT, () => {
    console.log("SERVER STARTED AT PORT " + PORT);
});