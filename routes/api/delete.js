const express = require('express');

const checkID = require('../../middleware/checkID.js');
const userController = require('../../controllers/userController.js');

const router = express.Router();

// Delete endpoints
router.delete('/user/delete/record', checkID, userController.delete_user);
module.exports = router;
