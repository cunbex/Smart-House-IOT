const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multerConfig = require('../../services/multerConfig');

const router = express.Router();
const prisma = new PrismaClient();

// Use Multer configuration for handling file uploads
const upload = multerConfig;

// Handle file upload in the /upload endpoint
router.post('/', upload, async (req, res) => {
    try {
        if (!req.body.id) {
            return res
                .status(400)
                .json({ msg: 'Please include user ID in the request body' });
        }
        const userId = req.body.id;
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }
        const newPicturePath = `/public/images/${req.file.filename}`;
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                picturePath: newPicturePath,
            },
        });

        res.status(200).json({
            msg: 'Profile picture uploaded and user updated successfully',
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
});

module.exports = router;
