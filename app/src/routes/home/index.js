"use strict";
const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/home", ctrl.output.home);

router.get("/login", ctrl.output.login);
router.post("/login", ctrl.process.login);

router.get("/customer/:id", ctrl.process.getCustomer); // 이 부분 추가

router.get("/customer_list", ctrl.output.customer_list);
router.post("/customer/edit", ctrl.process.editCustomer);

router.get("/order_entry", ctrl.output.order_entry);
router.post("/order_entry", ctrl.process.order_entry);

router.get("/order_list", ctrl.output.order_list);
// 삭제 요청 처리 라우터 수정
router.post("/order_list/delete", ctrl.process.deleteOrder);


router.get("/signup", ctrl.output.signup);
router.post("/signup", ctrl.process.signup);
router.get("/logout", ctrl.process.logout);




module.exports = router;