const express = require('express');
const methodOverride = require('method-override');
const prisma = require('../services/prisma_init');
const multerConfig = require('../services/multerConfig');
const checkID = require('../middleware/checkID');
const checkEmail = require('../middleware/checkEmail');

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
const userController = require('../controllers/userController');

// Create endpoint
router.post('/create', checkEmail, userController.user_create);

// Delete endpoint
router.delete('/delete', checkID, userController.user_delete);

// Read endpoint
router.get('/read', userController.user_list);
router.get('/read/picture', checkID, userController.user_picture_get);

// Update endpoint
router.put('/update/password', checkID, userController.user_password_update);
router.put(
    '/update/email',
    checkID,
    checkEmail,
    userController.user_email_update,
);
router.put('/update/name', checkID, userController.user_name_update);

// Upload endpoint
router.post('/upload', upload, userController.user_picture_post);

module.exports = router;
