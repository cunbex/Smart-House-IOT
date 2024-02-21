const express = require('express');
const methodOverride = require('method-override');
const prisma = require('../../services/prisma_init');
const multerConfig = require('../../services/multerConfig');

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

// checkID middleware
async function checkID(req, res, next) {
    const userId = req.body.id;
    if (!userId) {
        return res.status(400).json({
            msg: 'User ID is missing in the request body',
        });
    }
    const result = await req.prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!result) {
        return res.status(404).json({
            msg: `User with ID: ${req.body.id} not found in DB`,
        });
    }
    next();
}

// import routes
const createRouter = require('./create');
const updateRouter = require('./update');
const deleteRouter = require('./delete');
const readRouter = require('./read');
const uploadRouter = require('./upload');
const authRouter = require('./auth');

// Dynamic routes
router.use('/create', createRouter);
router.use('/update', checkID, updateRouter);
router.use('/delete', checkID, deleteRouter);
router.use('/read', readRouter);
router.use('/upload', upload, uploadRouter);
router.use('/auth', authRouter);
module.exports = router;
