const multer = require("multer");

exports.upload = async (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.mimetype === "audio/mp3") {
        cb(null, "audiostorage");
      } else if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, "trxImg");
      } else {
        console.log(file.mimetype);
        cb({ error: "Mime type not supported" });
      }
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  const upload = multer({ storage: storage }).single("attache");

  upload(req, res, function (error) {
    if (error instanceof multer.MulterError) {
      console.log(error);
      return res.status(500).json(error);
    } else if (error) {
      return res.status(500).json(error);
    }
    next();
  });
};