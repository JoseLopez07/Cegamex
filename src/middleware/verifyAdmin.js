// should only be used in conjunction with verifyToken
module.exports = async function (req, res, next) {
    if (!req.user.adm) {
        return res
            .status(403)
            .send({ error: 'Not enough privileges for the request' });
    }
    return next();
};
