// mode should be either 'token' or 'params'
module.exports = function (mode) {
    if (mode === 'token') {
        return function (req, _, next) {
            req.userId = req.user.id;
            return next();
        };
    } else if (mode === 'params') {
        return function (req, res, next) {
            const parsedId = parseInt(req.params.userId);
            if (isNaN(parsedId) || parsedId === 0) {
                return res.status(400).send({ error: 'Invalid user id' });
            }
            req.userId = parsedId;
            return next();
        };
    } else {
        throw new Error('Invalid user id selection option');
    }
};
