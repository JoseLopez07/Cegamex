const jwtMiddleware = require('express-jwt');
const { UnauthorizedError } = require('express-jwt');

// import env vars
require('dotenv').config();

// required env
const TOKEN_SECRET = process.env.TOKEN_SECRET;

function invalidToken(err, req, res, next) {
    if (err instanceof UnauthorizedError || !req.user) {
        return res.status(401).send({
            error: 'Invalid or expired access token',
        });
    }
    return next(err);
}

module.exports = [
    jwtMiddleware({ secret: TOKEN_SECRET, algorithms: ['HS256'] }),
    invalidToken,
];
