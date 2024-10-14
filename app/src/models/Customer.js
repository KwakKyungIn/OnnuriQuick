"use strict";

const CustomerStorage = require("./CustomerStorage")
class Customer{
    constructor(body, sessionUser){ // sessionUser 추가
        this.body = body;
        this.sessionUser = sessionUser; // 세션 정보 저장
    }
    
    async order_entry(){
        const client = this.body;
        if (!this.sessionUser || !this.sessionUser.name) {
            return { success: false, msg: "세션 정보가 올바르지 않습니다." };
        }
        try{
            const response = await CustomerStorage.save(client, this.sessionUser); // sessionUser 전달
            return response;
        } catch(err){
            return { success: false, msg: `에러 발생: ${err}` };
        }
    }
}

module.exports = Customer;
