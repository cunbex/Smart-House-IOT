const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
    new GoogleStrategy(
        {
            // option for the google strategy
            clientID: process.env.clientID,
            clientSecret: process.env.clientSecret,
            callbackURL: '/user/auth/google/redirect',
        },
        (accessToken, refreshToken, profile, done) => {
            // passport callback function
            console.log('passport cb fn fired');
            console.log(profile);
        },
    ),
);
