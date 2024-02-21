const express = require('express');

const router = express.Router();

// delete user from db fn
async function userDelete(userId, prisma) {
    await prisma.user.delete({
        where: {
            id: userId,
        },
    });
}

// delete user
router.delete('/', async (req, res) => {
    try {
        await userDelete(req.body.id, req.prisma);
        res.status(200).json({ msg: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await req.prisma.$disconnect();
    }
});

module.exports = router;
