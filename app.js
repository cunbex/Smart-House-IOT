const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const createError = require('http-errors');
const passport = require('passport');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const expressSession = require('express-session');
const expressLayouts = require('express-ejs-layouts');

require('dotenv').config();

const prisma = new PrismaClient();
const errorHandler = require('./middleware/errorHandler');
const { mqttConnect } = require('./controllers/mqttController');
const { mqttEvents } = require('./controllers/mqttController');

// import routes
const pagesRouter = require('./routes/pages_routes');
const usersRouter = require('./routes/api/user');

const app = express();

// Use CORS
app.use(cors());

// logger + req body + static files middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('./services/passport');

// Middleware to attach Prisma client to the request object
app.use((req, res, next) => {
    req.prisma = prisma;
    next();
});

// Use express-session middleware globally
app.use(
    expressSession({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, // ms
        },
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        store: new PrismaSessionStore(new PrismaClient(), {
            checkPeriod: 2 * 60 * 1000, // ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }),
    }),
);

// Initialize Passport middleware after express-session
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.use(expressLayouts);
app.set('layout', './layouts/landing');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Dynamic routes
app.use(mqttConnect, mqttEvents);
app.use('/', pagesRouter);
app.use('/api', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
