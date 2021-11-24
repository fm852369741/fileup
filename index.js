const express = require("express");
const crypto = require("crypto");
const path = require("path");
const database = require('./database');
const router = require('./router');

const app = express();
const httpPort = process.env.PORT || 80;

app.use('/', router);
app.set("view engine", "ejs");
app.use("/public", express.static(path.join("./public")));

app.listen(httpPort, () => {
   database.connect().then(() => console.log('Connected'))
});
