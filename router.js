const multer = require("multer");
const app = require("express").Router();

String.prototype.hashCode = function () {
   var hash = 0,
      i,
      chr;
   if (this.length === 0) return hash;
   for (i = 0; i < this.length; i++) {
      chr = this.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
   }
   return hash;
};

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "./uploads/");
   },
   filename: function (req, file, cb) {
      const fileName = crypto.randomBytes(64).toString("hex");
      const fileExtension = file.originalname.replace(/.*\.(.*)/gm, "$1");
      const middleware = crypto.randomBytes(32).toString("hex");

      cb(
         null,
         `${fileName}.${middleware}.${middleware.hashCode()}.${fileExtension}`
      );
   },
});

const uploader = multer({ storage: storage });
const uploadMultipleFilesMiddleware = uploader.single("file");

app.get("/", (req, res) => {
   res.render("index");
});

app.post("/ajax/upload", uploadMultipleFilesMiddleware, (req, res) => {
   res.json({
      status: true,
      message: `${req.file.originalname} uploaded successfully!`,
   });
});

app.get("/download/:file", (req, res) => {
   res.download(path.join("./uploads/", req.params.file));
});

app.get("/upload", (req, res) => {
   res.render("upload");
});

module.exports = app;
