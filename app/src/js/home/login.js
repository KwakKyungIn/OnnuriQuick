"use strict";

const login_id = document.querySelector("#login_id"),
    password = document.querySelector("#password"),
    loginBtn1 = document.querySelector("#loginBtn");

console.log(login_id);


loginBtn1.addEventListener("click", login);

function login(){
    const req ={
        id : login_id.value,
        password : password.value,
    };
    console.log(req);
}

