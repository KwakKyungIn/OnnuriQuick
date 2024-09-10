"use strict";
const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/home", ctrl.home);

router.get("/login", ctrl.login);

router.get("/customer_list", ctrl.customer_list);

router.get("/order_entry", ctrl.order_entry);

router.get("/order_list", ctrl.order_list);

router.get("/signup", ctrl.signup);

module.exports = router;