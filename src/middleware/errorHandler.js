module.exports = function (err, _, res, _) {
    console.error(err.stack);
    return res.status(500).send({
        error: "Couldn't process the request",
    });
};
