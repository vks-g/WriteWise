const { ValidatorToken } = require('@/utils/validatorToken');

const AuthenticateUser = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    try {
        const payload = ValidatorToken(token);
        req.user = payload;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = { AuthenticateUser };