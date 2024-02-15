const express = require('express');

const router = express.Router();

// import routes
const createRouter = require('./create');
const updateRouter = require('./update');
const deleteRouter = require('./delete');
const readRouter = require('./read');
const uploadRouter = require('./upload');
const authRouter = require('./auth');
// Dynamic routes
router.use('/create', createRouter);
router.use('/update', updateRouter);
router.use('/delete', deleteRouter);
router.use('/read', readRouter);
router.use('/upload', uploadRouter);
router.use('/auth', authRouter);
module.exports = router;
