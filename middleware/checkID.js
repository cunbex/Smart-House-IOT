const asyncHandler = require('express-async-handler');
// checkID middleware

const checkID = asyncHandler(async (req, res, next) => {
    const userId = req.body.id;
    if (!userId) {
        return next({ statusCode: 400, message: 'no id provided' });
    }
    const result = await req.prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!result) {
        return next({ statusCode: 404, message: 'user not found' });
    }
    next();
});
module.exports = checkID;
