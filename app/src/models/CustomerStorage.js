"use strict";
const db = require("../config/db");

class CustomerStorage {

    // 고객 정보 및 주문 정보 저장 함수
    static async save(customerInfo, sessionUser) {
        return new Promise((resolve, reject) => {
            const checkCustomerQuery = `
                SELECT idx FROM customers WHERE phone_number = ? AND address = ?;
            `;
            
            db.query(checkCustomerQuery, [customerInfo.phone_number, customerInfo.address], (err, result) => {
                if (err) {
                    return reject(`고객 정보 확인 오류: ${err}`);
                }
    
                let customerIdx;
                if (result.length > 0) {
                    customerIdx = result[0].idx;
                    generateOrderNumberAndSave(customerIdx);
                } else {
                    const customerQuery = `
                        INSERT INTO customers(name, phone_number, zipcode, address, extra_address, detail_address, registered_store)
                        VALUES(?, ?, ?, ?, ?, ?, ?);  
                    `;
                    db.query(customerQuery, [
                        customerInfo.customer_name, 
                        customerInfo.phone_number, 
                        customerInfo.zipcode, 
                        customerInfo.address, 
                        customerInfo.extra_address, 
                        customerInfo.detail_address,
                        sessionUser.name  // 세션 사용자 이름을 registered_store에 저장
                    ], (err, customerResult) => {
                        if (err) {
                            return reject(`고객 정보 저장 오류: ${err}`);
                        }
                        customerIdx = customerResult.insertId;
                        generateOrderNumberAndSave(customerIdx);
                    });
                }
    
                // 주문 번호 생성 및 주문 정보 저장 함수
                function stringToNumber(str) {
                    let num = 0;
                    for (let i = 0; i < str.length; i++) {
                        num += str.charCodeAt(i);
                    }
                    return num % 100;
                }
    
                function generateOrderNumberAndSave(customerIdx) {
                    const today = new Date();
                    const month = String(today.getMonth() + 1).padStart(2, '0');
                    const day = String(today.getDate()).padStart(2, '0');
                    const datePrefix = `${month}${day}`;
    
                    const userPrefix = stringToNumber(sessionUser.id);
    
                    const userOrderCountQuery = `
                        SELECT COUNT(*) AS count FROM order_info 
                        WHERE DATE(order_time) = CURDATE() AND store_name = ?;
                    `;
    
                    db.query(userOrderCountQuery, [sessionUser.name], (err, countResult) => {
                        if (err) {
                            return reject(`사용자별 주문 수 확인 오류: ${err}`);
                        }
    
                        const userOrderCount = countResult[0].count + 1;
                        const orderNumber = `${String(userPrefix).padStart(2, '0')}${datePrefix}${String(userOrderCount).padStart(3, '0')}`;
    
                        // 주문 정보를 저장하는 함수
                        const orderInfoQuery = `
                            INSERT INTO order_info(order_number, request, special_notes, entrance_password, customer_info, status, store_name, card)
                            VALUES(?, ?, ?, ?, ?, '배차 대기', ?, ?);  
                        `;
                        
                        db.query(orderInfoQuery, [
                            orderNumber,
                            customerInfo.request,
                            customerInfo.special_notes,
                            customerInfo.entrance_password,
                            customerIdx,
                            sessionUser.name,  // store_name
                            customerInfo.card_misu  // 카드 미수 (체크박스 값)
                        ], (err, orderResult) => {
                            if (err) {
                                return reject(`주문 정보 저장 오류: ${err}`);
                            }
                            resolve({ success: true, orderNumber: orderNumber });
                        });
                    });
                }
            });
        });
    }
    
    static async update(customerIdx, customerData) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE customers 
                SET name = ?, phone_number = ?, address = ? 
                WHERE idx = ?;
            `;
            db.query(query, [
                customerData.name, 
                customerData.phone_number, 
                customerData.address,
                customerIdx
            ], (err, result) => {
                if (err) {
                    console.error(`고객 정보 수정 오류: ${err}`); 
                    return reject(`고객 정보 수정 오류: ${err}`);
                }
                console.log("업데이트 결과:", result);
                resolve({ success: true });
            });
        });
    }
}

module.exports = CustomerStorage;
