const express = require('express');
const passport = require('passport');

const multerConfig = require('../../services/multerConfig.js');
const { checkEmailValid } = require('../../middleware/checkEmail.js');
const checkAccValid = require('../../middleware/checkAcc.js');
const userController = require('../../controllers/userController.js');
const checkID = require('../../middleware/checkID.js');

// Use Multer configuration for handling file uploads
const upload = multerConfig;
const router = express.Router();

// Post endpoints
router.post('/get/byid', checkID, userController.get_user_by_id);
router.post('/get/byemail', userController.get_user_by_email);
router.post('/post/record', checkEmailValid, userController.post_user);
router.post('/post/picture', upload, userController.post_user_picture);
router.post(
    '/post/login',
    checkAccValid,
    passport.authenticate('local', {
        failureMessage: true,
    }),
    async (req, res) => {
        res.status(200).json({
            success: true,
            message: 'User Authenticated',
            url: '/dashboard',
        });
    },
);
module.exports = router;
