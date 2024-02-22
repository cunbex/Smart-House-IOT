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

// Post endpoints
router.post('/post/record', checkEmail, userController.post_user);
router.post('/post/picture', upload, userController.post_user_picture);

// Delete endpoints
router.delete('/delete/record', checkID, userController.delete_user);

// GET endpoints
router.get('/get/all', userController.get_user_list);
router.get('/get/picture', checkID, userController.get_user_picture);
router.get('/get/byemail', checkID, userController.get_user_by_email);
router.get('/get/byid', checkID, userController.get_user_by_id);

// Put endpoints
router.put('/put/password', checkID, userController.put_user_password);
router.put('/put/email', checkID, checkEmail, userController.put_user_email);
router.put('/put/name', checkID, userController.put_user_name);

module.exports = router;
