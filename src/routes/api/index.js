const express = require('express');
const verifyJson = require('../../middleware/verifyJson');
const authRoutes = require('./auth');

const router = express.Router();

// enable JSON parsing middleware
router.use(express.json());

// user JSON validating middleware
router.use(verifyJson);

// use routes
router.use('/auth', authRoutes);

module.exports = router;
