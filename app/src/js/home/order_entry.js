"use strict";

const customer_name = document.querySelector("#customer_name"),
    phone_number = document.querySelector("#phone_number"),
    zipcode = document.querySelector("#sample6_postcode"),
    address = document.querySelector("#sample6_address"),
    extra_address = document.querySelector("#sample6_extraAddress"),
    detail_address = document.querySelector("#sample6_detailAddress"),
    takeBtn = document.querySelector("#takeBtn");





takeBtn.addEventListener("click", order_entry);


function order_entry(){
    
    if(!customer_name.value) return alert("수령인 이름을 입력해주십시오");
    if(!phone_number.value) return alert("수령인 번호를 입력해주십시오");
    if(!zipcode.value) return alert("우편번호를 입력해주십시오");
    
    if(!address.value) return alert("주소를 입력해주십시오");
    
    const req ={
        customer_name : customer_name.value,
        phone_number : phone_number.value,
        zipcode : zipcode.value,
        address : address.value,
        extra_address : extra_address.value,
        detail_address : detail_address.value,
    };
    
  
    fetch("/order_entry",{
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
            location.href ="/order_entry";
            alert("주문이 정상적으로 등록되었습니다");
        } else{
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error(new Error("주문입력중 중 에러 발생"))
    });
    
}
