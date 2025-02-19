const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../config/cloudinaryConfig");

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const { chatId } = req.params;
        const originalNameWithoutExtension = file.originalname.replace(/\.[^/.]+$/, "");
        return {
            folder: `med_VQA_Data/questions_images/${chatId}`,
            public_id: `${Date.now()}-${originalNameWithoutExtension}`,
        };
    },
});

const upload = multer({ storage });

module.exports = upload;
