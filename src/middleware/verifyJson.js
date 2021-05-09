module.exports = function (err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send({
            error: 'Invalid JSON data',
        });
    } else {
        // pass the error to the next middleware if it wasn't a JSON parse error
        return next(err);
    }
};
