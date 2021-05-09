const { UnauthorizedError } = require('express-jwt');

module.exports = function (err, req, res, next) {
    if (err instanceof UnauthorizedError || !req.user) {
        return res.status(StatusCodes.UNAUTHORIZED).send({
            error: 'Invalid or expired access token',
        });
    } else {
        return next(err);
    }
};
