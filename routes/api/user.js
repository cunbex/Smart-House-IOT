const express = require('express');
const methodOverride = require('method-override');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

const getRoutes = require('./get.js');
const putRoutes = require('./put.js');
const postRoutes = require('./post.js');
const deleteRoutes = require('./delete.js');

// Middleware to attach Prisma client to the request object
router.use((req, res, next) => {
    req.prisma = prisma;
    next();
});

// init header override with _method flag in url
router.use(methodOverride('_method'));

router.use('/user', [getRoutes, putRoutes, postRoutes, deleteRoutes]);

module.exports = router;
