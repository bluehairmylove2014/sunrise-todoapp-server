const jwt = require('jsonwebtoken');
const fs = require('fs');
const PRIVATE_KEY = fs.readFileSync('private-key.pem');

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    // console.log("Receive token: ", token)
    jwt.verify(token, PRIVATE_KEY, (err, decoded) => {
        if (err) {
            return res.sendStatus(401);
        }
        req.user_id = decoded.user_id;
        // console.log("decoded: ", decoded)
        next();
    });
};

module.exports = authenticateJWT;
