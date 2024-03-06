const express = require('express');

const { checkEmailValid } = require('../../middleware/checkEmail.js');
const checkID = require('../../middleware/checkID.js');
const userController = require('../../controllers/userController.js');

const router = express.Router();

// Put endpoints
router.put('/put/password', checkID, userController.put_user_password);
router.put(
    '/put/email',
    checkID,
    checkEmailValid,
    userController.put_user_email,
);
router.put('/put/name', checkID, userController.put_user_name);

module.exports = router;
