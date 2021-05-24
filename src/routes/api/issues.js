const express = require('express');
const db = require('../../db');
const verifyToken = require('../../middleware/verifyToken');

const router = express.Router();

router.get('/', verifyToken, async (_, res, next) => {
    try {
        const fechas = await db.getFechasIssue();
        return res.send(fechas);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
