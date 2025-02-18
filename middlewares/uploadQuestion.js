const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require('../utils/cloudinaryConfig');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "med_VQA_Data/questions_images",  
      public_id: (req, file) => {
        const originalNameWithoutExtension = file.originalname.replace(/\.[^/.]+$/, "");
        return `${Date.now()}-${originalNameWithoutExtension}`;
      },
    },
  });
  
  const upload = multer({ storage });
  
  module.exports =  upload;