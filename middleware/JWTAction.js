const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
    const key = process.env.jwt_signature;
    let decoded = null;

    try {
        decoded = jwt.verify(token, key);
    } catch (err) {
        console.log(err);
    }
    return decoded;
}

const checkUserJwt = (req, res, next) => {
    const cookies = req.cookies;

    if (cookies && cookies.token) {
        const token = cookies.token;
        const decoded = verifyToken(token);
        if (decoded) {
            req.decodedJWT = decoded;
            next();
        } else {
            return res.json({ "error": "token fail" });
        }
    } else {
        return res.json({ "error": "no token" });
    }
}

module.exports = checkUserJwt;