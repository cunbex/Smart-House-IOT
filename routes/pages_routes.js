const express = require('express');

const router = express.Router();

/* GET Index page. */
router.get('/', (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.render('index', {
            title: 'Smart House',
            state: 'My Account',
            value: 'user-Dashboard',
            layout: './layouts/landing',
        });
    }
    res.render('index', {
        title: 'Smart House',
        state: 'Get started',
        value: 'signup',
        layout: './layouts/landing',
    });
});

/* GET About page. */
router.get('/about', (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.render('about', {
            title: 'About',
            state: 'My Account',
            value: 'user-Dashboard',
            layout: './layouts/landing',
        });
    }
    res.render('about', {
        title: 'About',
        state: 'Get started',
        value: 'signup',
        layout: './layouts/landing',
    });
});

/* GET Careers page. */
router.get('/careers', (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.render('careers', {
            title: 'Careers',
            state: 'My Account',
            value: 'user-Dashboard',
            layout: './layouts/landing',
        });
    }
    res.render('careers', {
        title: 'Careers',
        state: 'Get started',
        value: 'signup',
        layout: './layouts/landing',
    });
});

/* GET Location page. */
router.get('/location', (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.render('location', {
            title: 'Location',
            state: 'My Account',
            value: 'user-Dashboard',
            layout: './layouts/landing',
        });
    }
    res.render('location', {
        title: 'Location',
        state: 'Get started',
        value: 'signup',
        layout: './layouts/landing',
    });
});

/* GET Login page. */
router.get('/login', (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.render('user-Dashboard', {
            title: 'user-Dashboard',
            layout: './layouts/dashboard',
        });
    }
    res.render('login', {
        title: 'Login',
        layout: './layouts/login-signup',
    });
});

/* GET Signup page. */
router.get('/signup', (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.render('user-Dashboard', {
            title: 'user-Dashboard',
            layout: './layouts/dashboard',
        });
    }
    res.render('signup', {
        title: 'Sign Up',
        layout: './layouts/login-signup',
    });
});

/*
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/user/protected-route');
    });
}); */

module.exports = router;
