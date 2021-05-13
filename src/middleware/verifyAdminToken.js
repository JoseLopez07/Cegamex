const verifyToken = require('./verifyToken');

async function checkAdminToken(err, req, res, next) {
    if (!req.user.adm) {
        return res
            .status(403)
            .send({ error: 'Not enough privileges for the request' });
    }
    return next(err);
}

module.exports = [...verifyToken, checkAdminToken];
