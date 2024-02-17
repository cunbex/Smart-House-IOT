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

// update password fn
async function userUpdatePass(userId, newPass) {
    const hashedPassword = await hashPass(newPass);
    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            password: hashedPassword,
        },
    });
}

// update password
router.put('/password', async (req, res) => {
    if (!req.body.id) {
        return res.status(400).json({ msg: 'Please include ID' });
    }
    try {
        await userUpdatePass(req.body.id, req.body.password);
        res.status(200).json({ msg: 'Password changed successfully' });
    } catch (e) {
        console.error(e);
        if (e.code === 'P2025') {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } finally {
        await prisma.$disconnect();
    }
});

// update email fn
async function userUpdateEmail(userId, newEmail) {
    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            email: newEmail,
        },
    });
}
// update email
router.put('/email', async (req, res) => {
    if (!req.body.id) {
        return res.status(400).json({ msg: 'Please include ID' });
    }
    try {
        await userUpdateEmail(req.body.id, req.body.email);
        res.status(200).json({ msg: 'Email changed successfully' });
    } catch (e) {
        console.error(e);
        if (e.code === 'P2025') {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } finally {
        await prisma.$disconnect();
    }
});
module.exports = router;
