"use strict";

const home =(req,res) => {
    res.render("home/index");
};

const login =(req,res) => {
    res.render("home/login");
};

const customer_list =(req,res) => {
    res.render("home/customer_list");
};

const order_entry =(req,res) => {
    res.render("home/order_entry");
};

const order_list =(req,res) => {
    res.render("home/order_list");
};

const signup =(req,res) => {
    res.render("home/signup");
};
module.exports = {
    home,
    login,
    customer_list,
    order_entry,
    order_list,
    signup,
};
