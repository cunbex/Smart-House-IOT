// checkID middleware
async function checkID(req, res, next) {
    const userId = req.body.id;
    if (!userId) {
        return res.status(400).json({
            msg: 'User ID is missing in the request body',
        });
    }
    const result = await req.prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!result) {
        return res.status(404).json({
            msg: `User ID not found in DB`,
        });
    }
    next();
}

module.exports = checkID;
