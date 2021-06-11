const express = require('express');
const db = require('../../../db');
const verifyAdmin = require('../../../middleware/verifyAdmin');
const verifyParams = require('../../../middleware/verifyParams');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        console.log(req.query);
        const results = await db.queryIssues(req.query);
        return res.send(results);
    } catch (err) {
        return next(err);
    }
});

router.post(
    '/',
    verifyAdmin,
    verifyParams(
        'id',
        'type',
        'name',
        'asigneeId',
        'state',
        'startDate',
        'endDate',
        'priority'
    ),
    async (req, res, next) => {
        try {
            await db.insertIssue(req.body);
            return res.status(201).send();
        } catch (err) {
            return next(err);
        }
    }
);

router.get('/dates', async (_, res, next) => {
    try {
        const fechas = await db.getCountFechasIssues();
        return res.send(fechas);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
