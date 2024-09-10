"use strict";

const login_id = document.querySelector("#login_id"),
    password = document.querySelector("#password"),
    loginBtn1 = document.querySelector("#loginBtn");




loginBtn1.addEventListener("click", login);

function login(){
    const req ={
        id : login_id.value,
        password : password.value,
    };
  
    fetch("/login",{
        method : "POST",
        headers:{
            "Content-Type" : "application/json",
        },
        body : JSON.stringify(req),
    })
    .then((res)=> res.json())
    .then((res)=> {
        if(res.success)
        {
            location.href ="/home";
        } else{
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error(new Error("로그인 중 에러 발생"))
    });
}

