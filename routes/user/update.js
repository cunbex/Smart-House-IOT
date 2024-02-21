const express = require('express');

const router = express.Router();

// import hash module
const hashPass = require('../../services/passwordHash');

// update password fn
async function userUpdatePass(userId, newPass, prisma) {
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

// update password route
router.put('/password', async (req, res) => {
    if (!req.body.id) {
        return res.status(400).json({ msg: 'Please include ID' });
    }
    try {
        await userUpdatePass(req.body.id, req.body.password, req.prisma);
        res.status(200).json({ msg: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await req.prisma.$disconnect();
    }
});

// update email fn
async function userUpdateEmail(userId, newEmail, prisma) {
    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            email: newEmail,
        },
    });
}
// update email route
router.put('/email', async (req, res) => {
    try {
        await userUpdateEmail(req.body.id, req.body.email, req.prisma);
        res.status(200).json({ msg: 'Email changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await req.prisma.$disconnect();
    }
});

// update name fn
async function userUpdateName(userId, newName, prisma) {
    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            email: newName,
        },
    });
}

// update name route
router.put('/name', async (req, res) => {
    try {
        await userUpdateName(req.body.id, req.body.name, req.prisma);
        res.status(200).json({ msg: 'Name changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await req.prisma.$disconnect();
    }
});

module.exports = router;
