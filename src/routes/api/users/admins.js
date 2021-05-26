const express = require('express');
const db = require('../../db');
const verifyParams = require('../../../middleware/verifyParams');
const selectUserId = require('../../../middleware/selectUserId');

const router = express.Router();

async function getUserAdmin(req, res, next) {
    try {
        const adm = await db.isUserAdmin(req.userId);
        return res.send({ adm });
    } catch (err) {
        return next(err);
    }
}

// method to check if OWN user is an admin (returned as {adm: <int>})
router.get('/', selectUserId('token'), getUserAdmin);

// method to check if ANY user is an admin (returned as {adm: <int>}, only for admins)
router.get('/:userId', verifyAdmin, selectUserId('params'), getUserAdmin);

// method to make/remove an admin (only accesible to other admins)
router.put(
    '/:userId',
    verifyAdmin,
    verifyParams('adm'),
    selectUserId('params'),
    async (req, res, next) => {
        try {
            await db.setUserAdmin(req.userId, req.body.adm);

            return res.status(204).send();
        } catch (err) {
            return next(err);
        }
    }
);

module.exports = router;
