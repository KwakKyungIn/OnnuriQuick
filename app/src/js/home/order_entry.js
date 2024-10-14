"use strict";

// 기존 코드와 동일하게 필요한 DOM 요소들을 불러옴
const customer_name = document.querySelector("#customer_name"),
    phone_number = document.querySelector("#phone_number"),
    zipcode = document.querySelector("#sample6_postcode"),
    address = document.querySelector("#sample6_address"),
    extra_address = document.querySelector("#sample6_extraAddress"),
    detail_address = document.querySelector("#sample6_detailAddress"),
    request = document.querySelector("#request"),
    entrance_password = document.querySelector("#entrance_password"),
    special_notes = document.querySelector("#special_notes"),
    card_misu = document.querySelector("#card_misu"),  // 체크박스 요소 추가
    takeBtn = document.querySelector("#takeBtn");

takeBtn.addEventListener("click", order_entry);

// 주문 접수 함수
function order_entry() {
    // 필수 값 체크
    if (!customer_name.value) return alert("수령인 이름을 입력해주십시오");
    if (!phone_number.value) return alert("수령인 번호를 입력해주십시오");
    if (!zipcode.value) return alert("우편번호를 입력해주십시오");
    if (!address.value) return alert("주소를 입력해주십시오");

    // 주문 정보 객체 생성
    const req = {
        customer_name: customer_name.value,
        phone_number: phone_number.value,
        zipcode: zipcode.value,
        address: address.value,
        extra_address: extra_address.value,
        detail_address: detail_address.value,
        entrance_password: entrance_password.value,
        special_notes: special_notes.value,
        request: request.value,
        card_misu: card_misu.checked ? 1 : 0,  // 체크박스 상태를 1(체크됨) 또는 0(체크 안됨)으로 처리
    };

    // 주문 정보 서버로 전송
    fetch("/order_entry", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.success) {
            location.href = "/order_entry";
            alert("주문이 정상적으로 등록되었습니다");
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error(new Error("주문 입력 중 에러 발생"));
    });
}
