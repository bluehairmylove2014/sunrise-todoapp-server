// authMiddleware.js

const jwt = require('jsonwebtoken');
const fs = require('fs');
const PRIVATE_KEY = fs.readFileSync('private-key.pem');

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    console.log('Verifying token: ')

    if (!token) {
        console.log('Token is not verified')
        return res.sendStatus(401);
    }

    // jwt.verify(token, PRIVATE_KEY, (err, decoded) => {
    //     if (err) {
    //         console.log('Error Verify token')
    //         return res.sendStatus(403);
    //     }
    //     req.user_id = decoded.user_id;
    //     console.log('Token verified. Your user id: ', decoded.user_id)
    //     next();
    // });
    req.user_id = 1;
    next();
};

module.exports = authenticateJWT;
