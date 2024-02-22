const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// import hash module
const hashPass = require('../../services/passwordHash');

// Add user to db fn
async function userAdd(userName, userEmail, userPassword, prisma) {
    const hashedPassword = await hashPass(userPassword);
    const userId = uuidv4();
    const defaultPicturePath = 'public/images/default.jpg';
    await prisma.user.create({
        data: {
            id: userId,
            email: userEmail,
            name: userName,
            password: hashedPassword,
            picturePath: defaultPicturePath,
        },
    });
}

// Post user
router.post('/', async (req, res) => {
    if (!req.body.name || !req.body.password) {
        res.status(400).json({
            msg: 'Please include name, and password',
        });
    }
    try {
        await userAdd(
            req.body.name,
            req.body.email,
            req.body.password,
            req.prisma,
        );
        res.status(201).json({ msg: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await req.prisma.$disconnect();
    }
});

module.exports = router;
