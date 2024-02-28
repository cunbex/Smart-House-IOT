const express = require('express');
const methodOverride = require('method-override');
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');

const { isAuth } = require('../middleware/authMiddleware.js');
const multerConfig = require('../services/multerConfig');
const checkID = require('../middleware/checkID');
const checkEmail = require('../middleware/checkEmail');

const router = express.Router();
const prisma = new PrismaClient();

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
router.get('/get/byemail', checkEmail, userController.get_user_by_email);
router.get('/get/byid', checkID, userController.get_user_by_id);

// Put endpoints
router.put('/put/password', checkID, userController.put_user_password);
router.put('/put/email', checkID, checkEmail, userController.put_user_email);
router.put('/put/name', checkID, userController.put_user_name);

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
