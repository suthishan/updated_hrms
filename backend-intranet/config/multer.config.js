const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        // Use a temp directory — req.body is NOT reliably available here
        const tempDir = path.resolve(__dirname, '../uploads/temp');

        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        cb(null, tempDir);
    },

    filename: function (req, file, cb) {
        // Use a unique temp name to avoid collisions
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

module.exports = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});