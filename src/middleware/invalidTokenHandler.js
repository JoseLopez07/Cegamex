const { UnauthorizedError } = require('express-jwt');

module.exports = function (err, req, res, next) {
    if (err instanceof UnauthorizedError || !req.user) {
        return res.status(401).send({
            error: 'Invalid or expired access token',
        });
    }
    return next(err);
};
