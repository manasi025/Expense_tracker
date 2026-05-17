const jwt = require("jsonwebtoken");

const SECRET_KEY = "mysecretkey";

module.exports = (req, res, next) => {

    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "No token"
        });
    }

    try {

        const verified = jwt.verify(token, SECRET_KEY);

        req.user = verified;

        next();

    } catch (err) {

        res.status(400).json({
            message: "Invalid token"
        });
    }
};