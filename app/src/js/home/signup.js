"use strict";

const signup_id = document.querySelector("#signup_id"),
    name = document.querySelector("#name"),
    password = document.querySelector("#password"),
    confirmPassword = document.querySelector("#confirm-password"),
    signupBtn = document.querySelector("#signupBtn");





signupBtn.addEventListener("click", signup);

function signup(){
    if(!signup_id.value) return alert("아이디를 입력해주십시오");
    if(!name.value) return alert("이름을 입력해주십시오");
    if(!password.value) return alert("비밀번호를 입력해주십시오");


    if(password.value !== confirmPassword.value){
        return alert("비밀번호가 일치하지 않습니다");
    }

    const req ={
        id : signup_id.value,
        name : name.value,
        password : password.value,
    };
    
  
    fetch("/signup",{
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
            location.href ="/login";
        } else{
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error(new Error("회원가입 중 에러 발생"))
    });
}

