"use strict";

const User = require("../../models/User");
const Customer = require("../../models/Customer");
//const UserStorage = require("../../models/UserStorage");


const output = {
    home : (req,res) => {
        res.render("home/index");
    },
    
    login : (req,res) => {
        res.render("home/login");
    },
    
    customer_list : (req,res) => {
        res.render("home/customer_list");
    },
    
    order_entry : (req,res) => {
        res.render("home/order_entry");
    },
    
    order_list : (req,res) => {
        res.render("home/order_list");
    },
    
    signup : (req,res) => {
        res.render("home/signup");
    },

}




const process = {
    login : async (req, res) => {
        const user = new User(req.body);
        const response = await user.login();
        return res.json(response);
 
    },

    signup : async (req, res) => {
        const user = new User(req.body);
        const response = await user.signup();
        return res.json(response);
    },

    order_entry : async (req, res) => {
        const customer = new Customer(req.body);
        const response = await customer.order_entry();
        return res.json(response);
    },

};


module.exports = {
    output,
    process,
};
