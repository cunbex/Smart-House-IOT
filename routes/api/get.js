const express = require('express');

const checkID = require('../../middleware/checkID.js');
const userController = require('../../controllers/userController.js');

const router = express.Router();

// GET endpoints
router.get('/user/get/all', userController.get_user_list);
router.get('/user/get/picture', checkID, userController.get_user_picture);

module.exports = router;
