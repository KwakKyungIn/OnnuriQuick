"use strict";




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


const users = {
    id : ["admin", "bmule"],
    password : ["1234", "5113"],
};

const process = {
    login : (req, res) => {
        const id = req.body.id,
        password = req.body.password;

        if(users.id.includes(id)){
            const idx = users.id.indexOf(id);
            if(users.password[idx]===password){
                return res.json({
                    success : true,
                });
            }
        }

        return res.json({
            success : false,
            msg : "로그인 실패",
        });
    },
};


module.exports = {
    output,
    process,
};
