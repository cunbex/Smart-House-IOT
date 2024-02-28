const asyncHandler = require('express-async-handler');

module.exports.isAuth = asyncHandler(async (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return next({
            statusCode: 401,
            message: 'You are not authenticated to view this resource',
        });
    }
});
