"use strict";

//모듈
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

//라우팅
const home = require("./src/routes/home");

//앱 세팅
app.set("views", "./src/views");    
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/src`));
app.use(bodyParser.json());
//url을 통해 전달되는 데이터에 한글, 공백과 같은 문자가 포함될 경우 제대로 인식 못하는 문제 해결
app.use(bodyParser.urlencoded({extended : true}));


app.use("/", home); // use는 미들웨어 등록 위한 메소드

module.exports = app;

