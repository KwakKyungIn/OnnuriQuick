"use strict";
const db = require("../config/db");

class CustomerStorage {

    // 고객 정보 불러오는 함수 (필요 시 구현)
    static getCustomers(isAll, ...fields) {
        // 여기에 추가적인 로직을 작성할 수 있습니다.
    }

    // 고객 정보 및 주문 정보 저장 함수
    static async save(customerInfo) {
        return new Promise((resolve, reject) => {
            // 고객 정보 저장 쿼리
            const customerQuery = `
                INSERT INTO customers(name, phone_number, zipcode, address, extra_address, detail_address)
                VALUES(?, ?, ?, ?, ?, ?);
            `;
            
            // 고객 정보 저장
            db.query(customerQuery, [
                customerInfo.customer_name, 
                customerInfo.phone_number, 
                customerInfo.zipcode, 
                customerInfo.address, 
                customerInfo.extra_address, 
                customerInfo.detail_address
            ], (err, customerResult) => {
                if (err) {
                    return reject(`고객 정보 저장 오류: ${err}`);
                }

                // 고객 정보가 성공적으로 저장된 후 주문 정보를 저장
                const orderInfoQuery = `
                    INSERT INTO order_info(request, special_notes, entrance_password)
                    VALUES(?, ?, ?);
                `;
                
                // 주문 정보 저장
                db.query(orderInfoQuery, [
                    customerInfo.request,
                    customerInfo.special_notes,
                    customerInfo.entrance_password,
                    //customerInfo.customer_info
                ], (err, orderResult) => {
                    if (err) {
                        return reject(`주문 정보 저장 오류: ${err}`);
                    }

                    // 고객 정보와 주문 정보가 모두 성공적으로 저장되었을 경우
                    resolve({ success: true });
                });
            });
        });
    }
}

module.exports = CustomerStorage;
