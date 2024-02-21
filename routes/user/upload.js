const express = require('express');

const router = express.Router();

// profile picture upload fn

async function uploadPfp(userId, filename, prisma) {
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
router.post('/', async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }

    try {
        await uploadPfp(req.body.id, req.file.filename, req.prisma);
        res.status(200).json({
            msg: 'Profile picture uploaded and user updated successfully',
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await req.prisma.$disconnect();
    }
});
module.exports = router;
