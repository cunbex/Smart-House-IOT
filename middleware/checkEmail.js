const asyncHandler = require('express-async-handler');

// checkID middleware

const checkEmailValid = asyncHandler(async (req, res, next) => {
    const userEmail = req.body.email;
    if (!userEmail) {
        return next({ statusCode: 400, message: 'no email provided' });
    }
    const result = await req.prisma.user.findUnique({
        where: {
            email: userEmail,
        },
    });
    if (result) {
        return next({ statusCode: 409, message: 'Email Exists' });
    }
    next();
});

const checkEmailInvalid = asyncHandler(async (req, res, next) => {
    const userEmail = req.body.email;
    if (!userEmail) {
        return next({ statusCode: 400, message: 'no email provided' });
    }
    const result = await req.prisma.user.findUnique({
        where: {
            email: userEmail,
        },
    });
    if (!result) {
        return next({ statusCode: 401, message: 'Invalid Email' });
    }
    next();
});

module.exports = { checkEmailValid, checkEmailInvalid };
