const multer = require("multer");
const dotenv = require("dotenv");

dotenv.config();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Only JPEG, PNG, WebP, and GIF are allowed.`
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_IMAGE_SIZE || 5242880),
  },
  fileFilter: fileFilter,
});

const uploadSingleImage = upload.single("file");
const uploadMultipleImages = upload.array("files", 5);

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  upload,
};
