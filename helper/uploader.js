const multer = require("multer");
const fs = require("fs");

module.exports = {
  uploader: (directory, fileNamePrefix) => {
    // diskStorage : untuk menyimpan file dari FE ke directory BE
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const pathDir = "./public" + directory;

        if (fs.existsSync(pathDir)) {
          console.log("Directory tersedia ✔");
          cb(null, pathDir);
        } else {
          fs.mkdir(pathDir, { recursive: true }, (err) => cb(err, pathDir));
        }
      },
      filename: (req, file, cb) => {
        let ext = file.originalname.split(".");
        let filename = fileNamePrefix + Date.now() + "." + ext[ext.length - 1];
        cb(null, filename);
      },
    });

    const fileFilter = (req, file, cb) => {
      const ext = /\.(jpg|jpeg|png|JPG|PNG|JPEG)/;
      if (!file.originalname.match(ext)) {
        return cb(
          new Error("Tipe ekstensi file yang anda masukkan tidak didukung!"),
          false
        );
      }
      cb(null, true);
    };

    return multer({
      storage,
      fileFilter,
    });
  },
};
