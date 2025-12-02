const { ValidatorToken } = require('@/utils/validatorToken');

// Optional authentication - attaches user if token exists, but doesn't require it
const OptionalAuth = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        req.user = null;
        return next();
    }
    try {
        const payload = ValidatorToken(token);
        req.user = payload;
        next();
    }
    catch (error) {
        req.user = null;
        next();
    }
};

module.exports = { OptionalAuth };
