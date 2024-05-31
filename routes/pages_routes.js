const express = require('express');

const router = express.Router();

/* GET Index page. */
router.get('/', (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.render('index', {
            title: 'Smart House',
            state: 'My Account',
            value: 'dashboard',
            layout: './layouts/landing',
        });
    }
    res.render('index', {
        title: 'Smart House',
        state: 'Get started',
        value: 'login',
        layout: './layouts/landing',
    });
});

/* GET About page. */
router.get('/about', (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.render('about', {
            title: 'About',
            state: 'My Account',
            value: 'dashboard',
            layout: './layouts/landing',
        });
    }
    res.render('about', {
        title: 'About',
        state: 'Get started',
        value: 'login',
        layout: './layouts/landing',
    });
});

/* GET Careers page. */
router.get('/careers', (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.render('careers', {
            title: 'Careers',
            state: 'My Account',
            value: 'dashboard',
            layout: './layouts/landing',
        });
    }
    res.render('careers', {
        title: 'Careers',
        state: 'Get started',
        value: 'login',
        layout: './layouts/landing',
    });
});

/* GET Location page. */
router.get('/location', (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.render('location', {
            title: 'Location',
            state: 'My Account',
            value: 'dashboard',
            layout: './layouts/landing',
        });
    }
    res.render('location', {
        title: 'Location',
        state: 'Get started',
        value: 'login',
        layout: './layouts/landing',
    });
});

/* GET Login page. */
router.get('/login', (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('dashboard');
    }
    res.render('login', {
        title: 'Log In',
        layout: './layouts/login-signup',
    });
});

/* GET Signup page. */
router.get('/signup', (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('dashboard');
    }
    res.render('signup', {
        title: 'Sign Up',
        layout: './layouts/login-signup',
    });
});

/* GET Dashboard page. */
router.get('/dashboard', (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.render('dashboard', {
            title: 'Dashboard',
            user: req.user,
            layout: './layouts/dashboard',
        });
    }
    res.redirect('login');
});

/* GET Devices page. */
router.get('/devices', (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.render('devices', {
            title: 'Devices',
            user: req.user,
            layout: './layouts/dashboard',
        });
    }
    res.redirect('login');
});

/* GET Settings page. */
router.get('/Settings', (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.render('settings', {
            title: 'Settings',
            user: req.user,
            layout: './layouts/dashboard',
        });
    }
    res.redirect('login');
});

/* Log out */
router.get('/logout', async (req, res, next) => {
    req.session.mqtt = false;
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = router;
