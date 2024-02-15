const express = require('express');

const router = express.Router();

// prisma init
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET users
router.get('/', async (req, res) => {
    try {
        const allUsers = await prisma.user.findMany();
        res.status(200).json(allUsers);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
});

/*
// GET user
router.get('/:id', async (req, res) => {
    try {
        const allUsers = await prisma.user.findMany();
        res.json(allUsers);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
});
*/

module.exports = router;
