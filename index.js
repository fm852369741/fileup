import * as leafacSqlite from "@leafac/sqlite";
import express from "express";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";

String.prototype.hashCode = function() {
   var hash = 0, i, chr;
   if (this.length === 0) return hash;
   for (i = 0; i < this.length; i++) {
     chr   = this.charCodeAt(i);
     hash  = ((hash << 5) - hash) + chr;
     hash |= 0;
   }
   return hash;
};

const httpPort = process.env.PORT || 80;

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "./uploads/");
   },
   filename: function (req, file, cb) {
      const fileName = crypto.randomBytes(64).toString("hex");
      const fileExtension = file.originalname.replace(/.*\.(.*)/gm, "$1");
      const middleware = crypto.randomBytes(32).toString('hex');

      cb(null, `${fileName}.${middleware}.${middleware.hashCode()}.${fileExtension}`);
   },
});

const database = new leafacSqlite.Database(path.join("./database/user.db"));

database.execute(
   leafacSqlite.sql`
        CREATE TABLE IF NOT EXISTS 'users' (
            'id' INTEGER PRIMARY KEY, 
            'username' TEXT, 
            'email' TEXT, 
            'password' TEXT,
            UNIQUE ('username', 'email')
        )
    `
);

database.execute(
   leafacSqlite.sql`
        CREATE TABLE IF NOT EXISTS 'files' (
            'id' INTEGER PRIMARY KEY, 
            'filename' TEXT,
            'username' TEXT,
            UNIQUE ('filename')
        )
    `
);

const app = express();
const uploader = multer({ storage: storage });
const uploadMultipleFilesMiddleware = uploader.single("file");

app.use("/public", express.static(path.join("./public")));
app.set("view engine", "ejs");

app.listen(httpPort);

app.get("/", (req, res) => {
   res.render("index");
});

app.post("/ajax/upload", uploadMultipleFilesMiddleware, (req, res) => {
   res.json({
      status: true,
      message: `${req.file.originalname} uploaded successfully!`,
   });
});

app.get('/')

app.get("/download/:file", (req, res) => {
   res.download(path.join("./uploads/", req.params.file));
});

app.get('/upload', (req, res) => {
   res.render("upload");
})