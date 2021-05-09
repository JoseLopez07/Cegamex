module.exports = function (err, _, res, _) {
    console.error(err.stack);
    return res.status(500).send({
        error: 'Internal error while handling the request',
    });
};
