const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
    destination: path.join(__dirname, process.env.PICTURE_PATH),
    filename: (req, file, callback) => {
        const userId = req.body.id || 'default';
        const extension = path.extname(file.originalname);
        callback(null, `${userId}${extension}`);
    },
});

const upload = multer({ storage });

module.exports = upload.single('picture');
