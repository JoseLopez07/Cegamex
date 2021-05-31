const express = require('express');
const db = require('../../../db');
const verifyAdmin = require('../../../middleware/verifyAdmin');
const verifyParams = require('../../../middleware/verifyParams');
const objectParser = require('../../../middleware/objectParser');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const results = await db.querySubtasks(req.query);
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
        'issueId',
        'name',
        'creatorEId',
        'leadEId',
        'reporterEId',
        'state',
        'startDate',
        'endDate'
    ),
    async (req, res, next) => {
        try {
            await db.insertSubtask(req.body);
            return res.status(201).send();
        } catch (err) {
            return next(err);
        }
    }
);

module.exports = router;
