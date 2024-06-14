const express = require('express');
const methodOverride = require('method-override');

const router = express.Router();

const getRoutes = require('./get.js');
const putRoutes = require('./put.js');
const postRoutes = require('./post.js');
const deleteRoutes = require('./delete.js');

// init header override with _method flag in url
router.use(methodOverride('_method'));

router.use('/', [getRoutes, putRoutes, postRoutes, deleteRoutes]);

module.exports = router;
