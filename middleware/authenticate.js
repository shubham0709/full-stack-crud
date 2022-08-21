require("dotenv").config();
const jwt = require("jsonwebtoken")

const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(400).send({ message: "try logging again" });
    }
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        if (err || decoded == undefined) {
            return res.status(400).send("login again");
        } else {
            req.body.email = decoded.email;
            next();
        }
    });
}

module.exports = { authenticate };