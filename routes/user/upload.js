const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multerConfig = require('../../services/multerConfig');

const router = express.Router();
const prisma = new PrismaClient();

// Use Multer configuration for handling file uploads
const upload = multerConfig;
// profile picture upload fn
async function uploadPfp(userId, filename) {
    const newPicturePath = `/public/images/${filename}`;
    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            picturePath: newPicturePath,
        },
    });
}

// profile Picture upload
router.post('/', upload, async (req, res) => {
    if (!req.body.id) {
        return res
            .status(400)
            .json({ msg: 'Please include user ID in the request body' });
    }
    if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }

    try {
        await uploadPfp(req.body.id, req.file.filename);
        res.status(200).json({
            msg: 'Profile picture uploaded and user updated successfully',
        });
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
