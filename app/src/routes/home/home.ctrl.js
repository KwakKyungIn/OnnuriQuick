"use strict";

const User = require("../../models/User");
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
    login : (req, res) => {
        const user = new User(req.body);
        const response = user.login();
        console.log(response);
        return res.json(response);
    //     const id = req.body.id,
    //         password = req.body.password;
        
    //     const users = UserStorage.getUsers("id", "password");
    //     const response ={};
    //     if(users.id.includes(id)){
    //         const idx = users.id.indexOf(id);
    //         if(users.password[idx]===password){
    //             response.success = true;
    //             return res.json(response);
    //         }
    //     }
    //     response.success = false;
    //     response.msg = "로그인에 실패하였습니다";

    //     return res.json(response);
    },
};


module.exports = {
    output,
    process,
};
