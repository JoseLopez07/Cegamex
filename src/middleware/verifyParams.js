module.exports = function (...args) {
    return function (req, res, next) {
        const result = args.filter((param) => req.body[param] === undefined);
        if (result.length) {
            return res
                .status(400)
                .send({ error: `No ${result.join(', ')} given` });
        }
        return next();
    };
};
