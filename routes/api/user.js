const express = require('express');
const methodOverride = require('method-override');
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');

const { isAuth } = require('../../middleware/authMiddleware.js');

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
/// ///////////////////////////////////
router.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/user/login-failure',
        successRedirect: '/user/login-success',
    }),
);

router.get('/login-success', (req, res, next) => {
    res.send(
        '<p>You successfully logged in. --> <a href="/user/protected-route">Go to protected</a></p>',
    );
});
router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/user/protected-route');
    });
});
router.get('/protected-route', isAuth, (req, res, next) => {
    res.send(
        '<p>You successfully logged in. --> <a href="/user/logout">logout</a></p>',
    );
});
router.get(
    '/login',
    async (req, res, next) => {
        if (req.isAuthenticated()) {
            res.redirect('/user/protected-route');
        }
        next();
    },
    (req, res, next) => {
        const form =
            '<h1>Login Page</h1><form method="POST" action="/user/login">\
    Enter Email:<br><input type="email" name="email">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

        res.send(form);
    },
);
module.exports = router;
