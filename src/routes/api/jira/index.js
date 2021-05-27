const express = require('express');
const verifyToken = require('../../../middleware/verifyToken');
const dbErrorHandler = require('../../../middleware/dbErrorHandler');

const issuesRoutes = require('./issues');
const subtasksRouter = require('./subtasks');

const router = express.Router();

router.use(verifyToken);

// use routes
router.use('/issues', issuesRoutes);
router.use('/subtasks', subtasksRouter);

router.use(dbErrorHandler);

module.exports = router;
