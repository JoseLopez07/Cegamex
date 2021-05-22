const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../../db');
const verifyToken = require('../../middleware/verifyToken');
const verifyAdminToken = require('../../middleware/verifyAdminToken');
const verifyParams = require('../../middleware/verifyParams');
const { RequestError } = require('mssql');

// used for generating the salt to encrypt passwords
const SALT_ROUNDS = 10;

const router = express.Router();

router.get('/', getCountIssuesFromMonth);

async function getCountIssuesFromMonth(req, res, next){
    try {
        const cant = await db.getIssuesFromMonth(req);
        return res.send(cant);
    } catch(err) {
        return next(err);
}
