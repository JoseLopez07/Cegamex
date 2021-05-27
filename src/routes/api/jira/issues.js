const express = require('express');
const db = require('../../../db');

const router = express.Router();

router.get('/', async (_, res, next) => {
    try {
        const fechas = await db.getCountFechasIssues();
        return res.send(fechas);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
