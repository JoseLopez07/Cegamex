const express = require('express');
const issuesRoutes = require('./issues');
const verifyToken = require('../../../middleware/verifyToken');

const router = express.Router();

router.user(verifyToken);

// use routes
router.use(issuesRoutes);

module.exports = router;
