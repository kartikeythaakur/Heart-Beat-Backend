const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    const uploadPath = path.join(`${process.cwd()}`,'uploads');
    cb(null,uploadPath);
  },
  filename: (req,file,cb) => {
    const uniqueName = Date.now();
    cb(null,uniqueName+path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

module.exports = upload;