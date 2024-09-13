"use strict";
const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/home", ctrl.output.home);

router.get("/login", ctrl.output.login);
router.post("/login", ctrl.process.login);


router.get("/customer_list", ctrl.output.customer_list);

router.get("/order_entry", ctrl.output.order_entry);
router.post("/order_entry", ctrl.process.order_entry);

router.get("/order_list", ctrl.output.order_list);

router.get("/signup", ctrl.output.signup);
router.post("/signup", ctrl.process.signup);



module.exports = router;