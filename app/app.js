"use strict";

//모듈
const express = require("express");
const app = express();

//라우팅
const home = require("./src/routes/home");

//앱 세팅
app.set("views", "./src/views");    
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/src`));


app.use("/", home); // use는 미들웨어 등록 위한 메소드

module.exports = app;

