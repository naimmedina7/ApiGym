const jwt = require("jsonwebtoken");
const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY

const authMiddleWare = (req, res, next) => {
    const authorization = req.headers["authorization"];
    const token = authorization?.startsWith("Bearer ")
        ? authorization.slice(7)
        : authorization;
    if (!token) {
        return res.status(401).json({ message: 'UnAuthorized - invalid token provided' });
    }

    try {
        const verified = jwt.verify(token, AUTH_SECRET_KEY);
        console.log(verified);
        
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ message: 'UnAuthorized - invalid token provided' });
    }
};

module.exports = authMiddleWare;