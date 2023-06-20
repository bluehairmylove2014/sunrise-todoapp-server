

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const PRIVATE_KEY = fs.readFileSync('private-key.pem');

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
        // Đọc dữ liệu từ file db.json
        const rawData = fs.readFileSync(path.join(__dirname, '..', 'db', 'db.json'));
        const jsonData = JSON.parse(rawData);

        // Tìm kiếm tài khoản dựa trên email và mật khẩu
        const account = jsonData.accounts.find(account => account.email === req.body.email && account.password === req.body.password);

        if (!account) {
            // Sai email hoặc mật khẩu
            res.status(401).json({code: 401, message: 'wrong email or password' });
        } else {
            const expiresIn = '1h';
            const tokenPayload = { user_id: account.id };
            const jwtBearerToken = jwt.sign(tokenPayload, PRIVATE_KEY, { algorithm: 'RS256', expiresIn });

            res.status(200).json({code: 200, token: jwtBearerToken }); // Trả về JWT token và thời gian hết hạn
        }
    } catch (err) {
        res.status(500).json({code:500, error: err });
    }
};
exports.handleRegister = function (req, res) {
    try {
        res.status(200).json('done');
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
}