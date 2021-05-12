const express = require('express');
const verifyToken = require('../../middleware/verifyToken');
const verifyParams = require('../../middleware/verifyParams');

const router = express.Router();

// method to register new user, email has to be unique
router.post(
    '/',
    verifyToken,
    verifyParams('firstName', 'lastName', 'email', 'password'),
    async (req, res, next) => {
        //
        res.send();
    }
);

// method to change user info
router.put('/', verifyToken, async (req, res, next) => {
    //
    res.send();
});

router.delete('/', verifyToken, async (req, res, next) => {
    //
    res.send();
});

module.exports = router;
