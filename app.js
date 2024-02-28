const createError = require('http-errors');
const express = require('express');
const path = require('path');
const passport = require('passport');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
// import routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');

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

app.use(async (req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Dynamic routes
app.use('/', indexRouter);
app.use('/user', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
