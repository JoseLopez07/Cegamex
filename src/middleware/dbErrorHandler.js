const { RequestError } = require('mssql');

module.exports = function (err, _, res, next) {
    if (err instanceof RequestError) {
        console.log(err);
        return res.status(400).send({
            error: 'Invalid parameter values',
        });
    }
    return next(err);
};
