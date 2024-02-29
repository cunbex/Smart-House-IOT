const express = require('express');

const multerConfig = require('../../services/multerConfig.js');
const checkEmail = require('../../middleware/checkEmail.js');
const userController = require('../../controllers/userController.js');

// Use Multer configuration for handling file uploads
const upload = multerConfig;
const router = express.Router();

// Post endpoints
router.post('/post/record', checkEmail, userController.post_user);
router.post('/post/picture', upload, userController.post_user_picture);

module.exports = router;
