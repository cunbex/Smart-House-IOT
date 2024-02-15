const express = require('express');
const methodOverride = require('method-override');

const router = express.Router();

// prisma init
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// init header override with _method flag in url
router.use(methodOverride('_method'));

// import hash module
const hashPass = require('../../services/passwordHash');

// update password
router.put('/password', async (req, res) => {
    try {
        const hashedPassword = await hashPass(req.body.password);
        await prisma.user.update({
            where: {
                id: req.body.id,
            },
            data: {
                password: hashedPassword,
            },
        });
        res.status(200).json({ msg: 'Password changed successfully' });
    } catch (e) {
        console.error(e);
        if (e.code === 'P2025') {
            // Record to update not found
            res.status(404).json({ error: 'User not found' });
        } else {
            // Other Prisma errors
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } finally {
        await prisma.$disconnect();
    }
});

// update email
router.put('/email', async (req, res) => {
    try {
        await prisma.user.update({
            where: {
                id: req.body.id,
            },
            data: {
                email: req.body.email,
            },
        });
        res.status(200).json({ msg: 'Email changed successfully' });
    } catch (e) {
        console.error(e);
        if (e.code === 'P2025') {
            // Record to update not found
            res.status(404).json({ error: 'User not found' });
        } else {
            // Other Prisma errors
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } finally {
        await prisma.$disconnect();
    }
});
module.exports = router;
