const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// prisma init
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// import hash module
const hashPass = require('../../services/passwordHash');

// Post user
router.post('/', async (req, res) => {
    try {
        if (!req.body.email || !req.body.name || !req.body.password) {
            return res
                .status(400)
                .json({ msg: 'Please include name, email, and password' });
        }
        const hashedPassword = await hashPass(req.body.password);
        const userId = uuidv4();
        const defaultPicturePath = 'public/images/default.jpg';
        await prisma.user.create({
            data: {
                id: userId,
                email: req.body.email,
                name: req.body.name,
                password: hashedPassword,
                picturePath: defaultPicturePath,
            },
        });
        res.status(201).json({ msg: 'User created successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
});

module.exports = router;
