const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Account = require('../db/models/account'); // Import the account model
const PRIVATE_KEY = 'private-key.pem';

exports.checkLogin = function (req, res) {
    try {
        const UID = req.user_id; // Get from middleware
        if(UID) {
            res.status(200).json({status: true});
        }
        else {
            res.status(403).json({status: false});
        }
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
}

exports.handleLogin = function (req, res) {
    try {
        // Search for account based on email and password
        Account.findOne({ email: req.body.email, password: req.body.password }, function(err, account) {
            if (err) {
                res.status(500).json({code:500, error: err });
            } else if (!account) {
                // Wrong email or password
                res.status(401).json({code: 401, message: 'wrong email or password' });
            } else {
                const expiresIn = '1h';
                const tokenPayload = { user_id: account.id };
                const jwtBearerToken = jwt.sign(tokenPayload, PRIVATE_KEY, { algorithm: 'RS256', expiresIn });

                res.status(200).json({code: 200, token: jwtBearerToken }); // Return JWT token and expiration time
            }
        });
    } catch (err) {
        res.status(500).json({code:500, error: err });
    }
};

exports.handleRegister = function (req, res) {
    try {
        const newAccount = new Account(req.body); // Create a new account with the request body
        newAccount.save(function(err) {
            if (err) {
                res.status(500).json({ error: err });
            } else {
                res.status(200).json('done');
            }
        });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
}