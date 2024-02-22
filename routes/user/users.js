const express = require('express');
const methodOverride = require('method-override');
const prisma = require('../../services/prisma_init');
const multerConfig = require('../../services/multerConfig');
const checkID = require('../../middleware/checkID');
const checkEmail = require('../../middleware/checkEmail');

const router = express.Router();

// Use Multer configuration for handling file uploads
const upload = multerConfig;

// Middleware to attach Prisma client to the request object
router.use((req, res, next) => {
    req.prisma = prisma;
    next();
});

// init header override with _method flag in url
router.use(methodOverride('_method'));

// import routes
const createRouter = require('./create');
const updateRouter = require('./update');
const deleteRouter = require('./delete');
const readRouter = require('./read');
const uploadRouter = require('./upload');

// Dynamic routes
router.use('/create', checkEmail, createRouter);
router.use('/update', checkID, updateRouter);
router.use('/delete', checkID, deleteRouter);
router.use('/read', readRouter);
router.use('/upload', upload, uploadRouter);
module.exports = router;
