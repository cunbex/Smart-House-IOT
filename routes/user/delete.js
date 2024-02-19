const express = require('express');
const methodOverride = require('method-override');
// prisma init
const { PrismaClient } = require('@prisma/client');

const router = express.Router();

const prisma = new PrismaClient();

// init header override with _method flag in url
router.use(methodOverride('_method'));

// delete user from db fn
async function userDelete(userId) {
    await prisma.user.delete({
        where: {
            id: Number(userId),
        },
    });
}

// delete user
router.delete('/', async (req, res) => {
    if (!req.body.id) {
        return res.status(400).json({ msg: 'Please include ID' });
    }
    try {
        await userDelete(req.body.id);
        res.status(200).json({ msg: 'User deleted successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
});
// ADD CODE WHEN USER ID DOESN'T EXIST IN DB
module.exports = router;
