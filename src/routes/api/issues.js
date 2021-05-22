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

router.get('/', getFechaIssues);

async function getFechasIssues(req, res, next){
    try {
        const fechas = await db.getFechaIssue();
        return res.send(fechas);
    } catch(err) {
        return next(err);
}
