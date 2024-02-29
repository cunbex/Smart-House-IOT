const express = require('express');

const checkEmail = require('../../middleware/checkEmail.js');
const checkID = require('../../middleware/checkID.js');
const userController = require('../../controllers/userController.js');

const router = express.Router();

// GET endpoints
router.get('/get/all', userController.get_user_list);
router.get('/get/picture', checkID, userController.get_user_picture);
router.get('/get/byemail', checkEmail, userController.get_user_by_email);
router.get('/get/byid', checkID, userController.get_user_by_id);

module.exports = router;
