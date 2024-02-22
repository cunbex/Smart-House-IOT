const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const path = require('node:path');
const fs = require('fs').promises;

// import hash module
const hashPass = require('../services/passwordHash');

// GET all users.
exports.get_user_list = asyncHandler(async (req, res, next) => {
    const allUsers = await req.prisma.user.findMany();
    res.status(200).json(allUsers);
});

// GET user picture.
exports.get_user_picture = asyncHandler(async (req, res, next) => {
    const result = await req.prisma.user.findUnique({
        where: {
            id: req.body.id,
        },
    });
    const filePath = path.resolve(__dirname, `../public/${result.picturePath}`);
    res.status(200).sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Sent:', result.picturePath);
        }
    });
});

// GET user by email
exports.get_user_by_email = asyncHandler(async (req, res, next) => {
    const result = await req.prisma.user.findUnique({
        where: {
            email: req.body.email,
        },
    });
    res.status(200).json(result);
});

// GET user by id
exports.get_user_by_id = asyncHandler(async (req, res, next) => {
    const result = await req.prisma.user.findUnique({
        where: {
            id: req.body.id,
        },
    });
    res.status(200).json(result);
});

// POST user
exports.post_user = asyncHandler(async (req, res, next) => {
    const hashedPassword = await hashPass(req.body.password);
    const userId = uuidv4();
    const defaultPicturePath = 'images/default.jpg';
    await req.prisma.user.create({
        data: {
            id: userId,
            email: req.body.email,
            name: req.body.name,
            password: hashedPassword,
            picturePath: defaultPicturePath,
        },
    });
    res.status(201).json({ msg: 'User created successfully' });
});

// POST picture
exports.post_user_picture = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }
    const newPicturePath = `/images/${req.file.filename}`;
    await req.prisma.user.update({
        where: {
            id: req.body.id,
        },
        data: {
            picturePath: newPicturePath,
        },
    });
    res.status(200).json({
        msg: 'Profile picture uploaded',
    });
});

// PUT password
exports.put_user_password = asyncHandler(async (req, res, next) => {
    if (!req.body.password) {
        return res.status(400).json({ msg: 'Please include password' });
    }
    const hashedPassword = await hashPass(req.body.password);
    await req.prisma.user.update({
        where: {
            id: req.body.id,
        },
        data: {
            password: hashedPassword,
        },
    });
    res.status(200).json({ msg: 'Password changed successfully' });
});

// PUT email
exports.put_user_email = asyncHandler(async (req, res, next) => {
    if (!req.body.email) {
        return res.status(400).json({ msg: 'Please include email' });
    }
    await req.prisma.user.update({
        where: {
            id: req.body.id,
        },
        data: {
            email: req.body.email,
        },
    });
    res.status(200).json({ msg: 'Email changed successfully' });
});

// PUT name
exports.put_user_name = asyncHandler(async (req, res, next) => {
    if (!req.body.name) {
        return res.status(400).json({ msg: 'Please include name' });
    }
    await req.prisma.user.update({
        where: {
            id: req.body.id,
        },
        data: {
            name: req.body.name,
        },
    });
    res.status(200).json({ msg: 'Name changed successfully' });
});

// DELETE user
exports.delete_user = asyncHandler(async (req, res, next) => {
    const result = await req.prisma.user.findUnique({
        where: {
            id: req.body.id,
        },
    });
    await req.prisma.user.delete({
        where: {
            id: req.body.id,
        },
    });
    if (result.picturePath !== 'images/default.jpg') {
        const filePath = path.resolve(
            __dirname,
            `../public/${result.picturePath}`,
        );
        await fs.access(filePath);
        await fs.unlink(filePath);
    }
    res.status(200).json({ msg: 'User deleted successfully' });
});
