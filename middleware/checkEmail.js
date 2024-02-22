// checkID middleware
async function checkEmail(req, res, next) {
    const userEmail = req.body.email;
    if (!userEmail) {
        return res.status(400).json({
            msg: 'User Email is missing in the request body',
        });
    }
    const result = await req.prisma.user.findUnique({
        where: {
            email: userEmail,
        },
    });
    if (result) {
        return res.status(409).json({
            msg: `User Email exists`,
        });
    }
    next();
}

module.exports = checkEmail;
