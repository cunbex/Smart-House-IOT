const express = require('express');
const path = require('node:path');

const router = express.Router();

// GET users
router.get('/', async (req, res) => {
    try {
        const allUsers = await req.prisma.user.findMany();
        res.status(200).json(allUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await req.prisma.$disconnect();
    }
});

router.get('/picture', async (req, res) => {
    try {
        const result = await req.prisma.user.findUnique({
            where: {
                id: req.body.id,
            },
        });
        const filePath = path.resolve(__dirname, `../../${result.picturePath}`);

        res.status(200).sendFile(filePath, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                console.log('Sent:', result.picturePath);
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await req.prisma.$disconnect();
    }
});

/*
// GET user
router.get('/:id', async (req, res) => {
    try {
        const allUsers = await prisma.user.findMany();
        res.json(allUsers);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
});
*/

module.exports = router;
