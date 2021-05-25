const express = require('express');
const verifyJson = require('../../middleware/verifyJson');
const authRoutes = require('./auth');
const usersRoutes = require('./users');
const issuesRoutes = require('./issues');
const achievsRoutes = require('./achievements');
const petsRoutes = require('./pets');

const router = express.Router();

// enable JSON parsing middleware
router.use(express.json());

// user JSON validating middleware
router.use(verifyJson);

// use routes
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/issues', issuesRoutes);
router.use('/achievements', achievsRoutes);
router.use('/pets', petsRoutes);

module.exports = router;
