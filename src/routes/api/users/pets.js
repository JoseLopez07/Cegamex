const express = require('express');
const db = require('../../../db');

const router = express.Router();

// import env vars
require('dotenv').config();

// optional env
const ISSUE_XP_QTTY = parseInt(process.env.ISSUE_XP_QTTY) || 4;
const SUBTASK_XP_QTTY = parseInt(process.env.SUBTASK_XP_QTTY) || 1;
const HIGH_PRTY_MULT = parseInt(process.env.HIGH_PRTY_MULT) || 3;
const MED_PRTY_MULT = parseInt(process.env.ISSUE_XP_QTTY) || 2;

// method to get pet info, by default gets own pet but an "userId" parameter can
// be used a specific users id
router.get('/', async (req, res, next) => {
    try {
        const queryUserId = parseInt(req.query.userId);

        if (!queryUserId && 'recalcXP' in req.query) {
            await db.recalcPetExperience(
                req.user.id,
                HIGH_PRTY_MULT,
                MED_PRTY_MULT,
                ISSUE_XP_QTTY,
                SUBTASK_XP_QTTY
            );
        }

        const result = await db.getUserPet(queryUserId || req.user.id);
        res.send(result);
    } catch (err) {
        return next(err);
    }
});

// method to change own pet info
router.put('/', async (req, res, next) => {
    try {
        await db.modifyUserPet(req.user.id, req.body);
        return res.status(204).send();
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
