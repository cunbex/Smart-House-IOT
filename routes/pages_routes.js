const express = require('express');

const router = express.Router();

/* GET Index page. */
router.get('/', (req, res, next) => {
    res.render('index', {
        title: 'Smart House',
        layout: './layouts/baseLayout',
    });
});

/* GET About page. */
router.get('/about', (req, res, next) => {
    res.render('about', { title: 'About', layout: './layouts/baseLayout' });
});

/* GET Careers page. */
router.get('/careers', (req, res, next) => {
    res.render('careers', { title: 'careers', layout: './layouts/baseLayout' });
});

/* GET Location page. */
router.get('/location', (req, res, next) => {
    res.render('location', {
        title: 'location',
        layout: './layouts/baseLayout',
    });
});

module.exports = router;
