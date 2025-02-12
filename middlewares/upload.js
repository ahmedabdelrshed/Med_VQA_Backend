const multer = require("multer");
const imageSize = require("image-size");
const appError = require("../utils/appError");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      appError.createError(
        "Only JPEG, PNG, and JPG files are allowed",
        400,
        "VALIDATION_ERROR"
      ),
      false
    );
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

  try {
    const dimensions = imageSize(req.file.buffer); // Get image dimensions
    if (
      dimensions.width < minWidth ||
      dimensions.width > maxWidth ||
      dimensions.height < minHeight ||
      dimensions.height > maxHeight
    ) {
      return next(
        appError.createError(
          `Image dimensions must be between ${minWidth}x${minHeight} and ${maxWidth}x${maxHeight} pixels.`,
          400,
          "VALIDATION_ERROR"
        )
      );
    }

    next();
  } catch (error) {
    return next(appError.createError("Invalid image file", 400, "VALIDATION_ERROR"));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = { upload, checkImageSize };
