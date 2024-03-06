const asyncHandler = require('express-async-handler');
const { validatePass } = require('../services/passwordHash');

// Check acc middleware

const checkAccValid = asyncHandler(async (req, res, next) => {
    const userEmail = req.body.email;
    const userPass = req.body.password;
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
    const isValid = await validatePass(userPass, result.password);
    if (!isValid) {
        return next({ statusCode: 401, message: 'Wrong Password' });
    }
    next();
});

module.exports = checkAccValid;
