const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const path = require('node:path');
const fs = require('fs').promises;

// import generate password module
const { genPass } = require(`../services/passwordHash`);

// GET all users.
exports.get_user_list = asyncHandler(async (req, res, next) => {
    const allUsers = await req.prisma.user.findMany();
    res.status(200).json({ success: true, status: 200, allUsers });
});

// GET user picture.
exports.get_user_picture = asyncHandler(async (req, res, next) => {
    const result = await req.prisma.user.findUnique({
        where: {
            id: req.body.id,
        },
    });
    const filePath = path.resolve(
        __dirname,
        `${process.env.GET_PICTURE_PATH + result.picture}`,
    );
    res.status(200).sendFile(filePath, (err) => {
        if (!err) console.log('Sent:', result.picture);
    });
});

// GET user by email
exports.get_user_by_email = asyncHandler(async (req, res, next) => {
    const result = await req.prisma.user.findUnique({
        where: {
            email: req.body.email,
        },
    });
    if (!result) {
        return next({ statusCode: 404, message: `Email doesn't exists` });
    }
    res.status(200).json({ success: true, status: 200, result });
});

// GET user by id
exports.get_user_by_id = asyncHandler(async (req, res, next) => {
    const result = await req.prisma.user.findUnique({
        where: {
            id: req.body.id,
        },
        include: {
            Controller: true,
        },
    });
    res.status(200).json({ success: true, status: 200, result });
});

// POST user
exports.post_user = asyncHandler(async (req, res, next) => {
    const hashedPassword = await genPass(req.body.password);
    const userId = uuidv4();
    const defaultPicturePath = process.env.DEFAULT_PICTURE_PATH;
    let response = await fetch(
        'https://mosquitto-api.onrender.com/api/client/add/record',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userId,
                password: '0000',
                clientid: userId,
                textname: req.body.name || '',
                textdescription:
                    `user Client with, Email:${req.body.email}` || '',
                roles: [{ rolename: 'lwt', priority: 0 }],
            }),
        },
    );
    if (response.ok) {
        response = await fetch(
            'https://mosquitto-api.onrender.com/api/client/enable/record',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: userId,
                    enable: true,
                }),
            },
        );
    }
    if (response.ok) {
        await req.prisma.user.create({
            data: {
                id: userId,
                email: req.body.email,
                name: req.body.name,
                password: hashedPassword,
                picture: defaultPicturePath,
            },
        });
    }
    res.status(201).json({
        success: true,
        status: 201,
        message: 'User created successfully',
    });
});

// POST picture
exports.post_user_picture = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next({ statusCode: 400, message: 'Please include file' });
    }
    const newPicturePath = `${process.env.POST_PICTURE_PATH + req.file.filename}`;
    await req.prisma.user.update({
        where: {
            id: req.body.id,
        },
        data: {
            picture: newPicturePath,
        },
    });
    res.status(200).json({
        success: true,
        status: 200,
        message: 'Profile picture uploaded',
    });
});

// PUT password
exports.put_user_password = asyncHandler(async (req, res, next) => {
    if (!req.body.password) {
        return next({
            statusCode: 400,
            message: 'Please include password',
        });
    }
    const hashedPassword = await genPass(req.body.password);
    await req.prisma.user.update({
        where: {
            id: req.body.id,
        },
        data: {
            password: hashedPassword,
        },
    });
    res.status(200).json({
        success: true,
        status: 200,
        message: 'Password changed successfully',
    });
});

// PUT email
exports.put_user_email = asyncHandler(async (req, res, next) => {
    await req.prisma.user.update({
        where: {
            id: req.body.id,
        },
        data: {
            email: req.body.email,
        },
    });
    res.status(200).json({
        success: true,
        status: 200,
        message: 'Email changed successfully',
    });
});

// PUT name
exports.put_user_name = asyncHandler(async (req, res, next) => {
    if (!req.body.name) {
        return next({ statusCode: 400, message: 'Please include name' });
    }
    await req.prisma.user.update({
        where: {
            id: req.body.id,
        },
        data: {
            name: req.body.name,
        },
    });
    res.status(200).json({
        success: true,
        status: 200,
        message: 'Name changed successfully',
    });
});

// DELETE user
exports.delete_user = asyncHandler(async (req, res, next) => {
    const result = await req.prisma.user.findUnique({
        where: {
            id: req.body.id,
        },
    });
    if (result) {
        await req.prisma.user.delete({
            where: {
                id: req.body.id,
            },
        });
        if (result.picture !== process.env.DEFAULT_PICTURE_PATH) {
            const filePath = path.resolve(
                __dirname,
                `${process.env.GET_PICTURE_PATH + result.picture}`,
            );
            await fs.access(filePath);
            await fs.unlink(filePath);
        }
    }
    const response = await fetch(
        'https://mosquitto-api.onrender.com/api/client/delete/record',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: req.body.id,
            }),
        },
    );
    if (response.ok) {
        res.status(200).json({
            success: true,
            status: 200,
            message: 'User deleted successfully',
        });
    } else {
        res.status(200).json({
            success: false,
            status: 500,
            message: 'Error deleting user from MQTT',
        });
    }
});
