const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');
const { validatePass } = require('./passwordHash');

const prisma = new PrismaClient();

const customFields = {
    usernameField: process.env.USERNAME_FIELD,
    passwordField: process.env.PASSWORD_FIELD,
};

const verifyCallBack = asyncHandler(async (username, password, done) => {
    const user = await prisma.user.findUnique({
        where: {
            email: username,
        },
    });
    if (!user) {
        return done(null, false);
    }
    const isValid = await validatePass(password, user.password);
    if (isValid) {
        return done(null, user);
    }
    return done(null, false);
});
const strategy = new LocalStrategy(customFields, verifyCallBack);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        done(null, user);
    } catch (err) {
        done(err);
    }
});
