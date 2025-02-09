const multer = require("multer");
const path = require("path");
const fs = require("fs");
const imageSize = require("image-size");
const appError = require("../utils/appError");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(appError.createError("Only JPEG, PNG, and JPG files are allowed", 400, "VALIDATION_ERROR"), false);
  }
};

const checkImageSize = (req, res, next) => {
  const minWidth = 300;
  const minHeight = 300;
  const maxWidth = 1000;
  const maxHeight = 1000;

  if (!req.file) {
    return next();
  }


    const dimensions = imageSize(req.file.buffer); 
    if (
      dimensions.width < minWidth ||
      dimensions.width > maxWidth ||
      dimensions.height < minHeight ||
      dimensions.height > maxHeight
    ) {
        const errorMessage = `Image dimensions must be between ${minWidth}x${minHeight} and ${maxWidth}x${maxHeight} pixels.`;
        const error = appError.createError(errorMessage, 400, "VALIDATION_ERROR");
        return next(error);
      }
    
      next();
    };



const saveImageToDisk = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const filePath = path.join(__dirname, "../uploads", fileName);

    fs.writeFileSync(filePath, req.file.buffer);
    req.file.path = filePath;

    next();
  } catch (err) {
    next(appError.createError("Error saving image to disk", 500, "INTERNAL_ERROR"));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = { upload, checkImageSize, saveImageToDisk };
