const express = require('express');
const methodOverride = require('method-override');
// prisma init
const { PrismaClient } = require('@prisma/client');

const router = express.Router();

const prisma = new PrismaClient();

// init header override with _method flag in url
router.use(methodOverride('_method'));

// delete user
router.delete('/', async (req, res) => {
    try {
        await prisma.user.delete({
            where: {
                id: req.body.id,
            },
        });
        res.status(200).json({ msg: 'User deleted successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
});

module.exports = router;
