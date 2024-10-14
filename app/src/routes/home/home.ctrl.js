"use strict";

const User = require("../../models/User");
const Customer = require("../../models/Customer");
const CustomerStorage = require("../../models/CustomerStorage");

const isLoggedIn = require("../../middleware/authMiddleware"); 
const db = require("../../config/db");

const output = {
    home: (req, res) => {
        res.render("home/index", { session: req.session });
    },
    
    login: (req, res) => {
        res.render("home/login",{ session: req.session });
    },
    
    customer_list: [isLoggedIn, (req, res) => {
        const limit = parseInt(req.query.limit) || 10;  // 한 페이지당 고객 수 (기본값: 10)
        const page = parseInt(req.query.page) || 1;     // 현재 페이지 (기본값: 1)
        const offset = (page - 1) * limit;
    
        const customerInfo = req.query.customer_info || '';  // 고객명
        const phoneNumber = req.query.phone_number || '';    // 휴대폰 번호
    
        // 검색 조건 추가
        let query = `SELECT * FROM customers WHERE registered_store = ?`;  // 세션 사용자 이름과 매칭
        let queryParams = [req.session.user.name];  // 세션 사용자 이름을 필터로 추가
    
        if (customerInfo) {
            query += ` AND name LIKE ?`;
            queryParams.push(`%${customerInfo}%`);
        }
    
        if (phoneNumber) {
            if (/^\d+$/.test(phoneNumber)) {  // 전화번호 형식 체크
                query += ` AND phone_number LIKE ?`;
                queryParams.push(`%${phoneNumber}%`);
            } else {
                return res.status(400).send('유효하지 않은 전화번호 형식입니다.');  // 유효하지 않은 번호 처리
            }
        }
    
        // 페이징 처리
        query += ` LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);
    
        // 검색된 결과 가져오기
        db.query(query, queryParams, function(err, result) {
            if (err) {
                console.error('쿼리 실행 중 오류:', err); 
                return res.status(500).send('데이터를 가져오는 중 오류가 발생했습니다.');
            }
    
            // 검색된 결과에 맞는 총 고객 수 구하기
            let countQuery = `SELECT COUNT(*) AS count FROM customers WHERE registered_store = ?`;
            let countParams = [req.session.user.name];  // 동일하게 세션 사용자 이름을 필터로 사용
    
            if (customerInfo) {
                countQuery += ` AND name LIKE ?`;
                countParams.push(`%${customerInfo}%`);
            }
    
            if (phoneNumber) {
                countQuery += ` AND phone_number LIKE ?`;
                countParams.push(`%${phoneNumber}%`);
            }
    
            db.query(countQuery, countParams, (err, data) => {
                if (err) {
                    return res.status(500).send('총 고객 수를 가져오는 중 오류가 발생했습니다.');
                }
    
                const totalCustomers = data[0].count;
                const totalPages = Math.ceil(totalCustomers / limit);
    
                res.render('home/customer_list', {
                    customers: result,
                    currentPage: page,
                    totalPages: totalPages,
                    limit: limit,
                    customerInfo: customerInfo,
                    phoneNumber: phoneNumber,
                    session: req.session
                });
            });
        });
    }],
    
    order_entry: [isLoggedIn, async (req, res) => {
        try {
            const customersQuery = `SELECT * FROM customers WHERE registered_store = ?`;  // registered_store 필터 추가
            const queryParams = [req.session.user.name];  // 세션 사용자 이름을 필터로 사용
    
            db.query(customersQuery, queryParams, (err, customers) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("고객 정보를 불러오는 중 오류가 발생했습니다.");
                }
                // 필터링된 고객 정보를 배열로 처리하고 EJS로 전달
                res.render("home/order_entry", {
                    session: req.session,
                    customers: Array.isArray(customers) ? customers : []  // 배열이 아닌 경우 빈 배열 처리
                });
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("고객 정보를 불러오는 중 오류가 발생했습니다.");
        }
    }],
    
    

    order_list: [isLoggedIn, (req, res) => {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;
        
        const status = req.query.status || '';
        const startDate = req.query.start_date || '';
        const endDate = req.query.end_date || '';
        const name = req.query.name || '';
        const orderNumber = req.query.order_number || '';
        const storeName = req.query.store_name || '';
        const deliveryPerson = req.query.delivery_person || '';  // 배달 기사 이름 필터 추가
    
        const sortBy = req.query.sort_by || 'order_time';  // 정렬 기준 추가 (기본값: order_number)
        
        let query = `
            SELECT 
                order_info.idx AS order_idx,
                order_info.status,
                order_info.order_time,
                order_info.order_number,
                order_info.store_name,
                order_info.card,
                order_info.delivery_person,
                customers.name,
                customers.phone_number,
                customers.address
            FROM 
                order_info
            JOIN 
                customers ON order_info.customer_info = customers.idx
            WHERE 
                1=1`;
        
        let queryParams = [];
    
        // 세션 사용자 이름으로 매장 이름 필터 추가
        if (req.session.user && req.session.user.name) {
            query += ` AND order_info.store_name = ?`;
            queryParams.push(req.session.user.name);
        }
    
        if (status) {
            query += ` AND order_info.status = ?`;
            queryParams.push(status);
        }
        if (startDate) {
            query += ` AND order_info.order_time >= ?`;
            queryParams.push(startDate);
        }
        if (endDate) {
            query += ` AND order_info.order_time <= ?`;
            queryParams.push(endDate);
        }
        if (name) {
            query += ` AND customers.name LIKE ?`;
            queryParams.push(`%${name}%`);
        }
        if (orderNumber) {
            query += ` AND order_info.order_number LIKE ?`;
            queryParams.push(`%${orderNumber}%`);
        }
        if (storeName) {
            query += ` AND order_info.store_name LIKE ?`;
            queryParams.push(`%${storeName}%`);
        }
        if (deliveryPerson) {
            query += ` AND order_info.delivery_person LIKE ?`;
            queryParams.push(`%${deliveryPerson}%`);
        }
    
        // 정렬 기준에 따라 쿼리 변경
        if (sortBy === 'order_number') {
            query += ` ORDER BY order_info.order_number DESC`;  // 주문 번호 기준 내림차순
        } else {
            query += ` ORDER BY order_info.order_time DESC`;  // 주문 시간 기준 내림차순
        }
    
        query += ` LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);
    
        db.query(query, queryParams, (err, result) => {
            if (err) {
                console.error('쿼리 실행 중 오류:', err);
                return res.status(500).send('데이터를 가져오는 중 오류가 발생했습니다.');
            }
    
            let countQuery = `SELECT COUNT(*) AS count FROM order_info
                              JOIN customers ON order_info.customer_info = customers.idx
                              WHERE 1=1`;
            let countParams = [];
    
            // 세션 사용자 이름으로 매장 이름 필터 추가
            if (req.session.user && req.session.user.name) {
                countQuery += ` AND order_info.store_name = ?`;
                countParams.push(req.session.user.name);
            }
    
            if (status) {
                countQuery += ` AND order_info.status = ?`;
                countParams.push(status);
            }
            if (startDate) {
                countQuery += ` AND order_info.order_time >= ?`;
                countParams.push(startDate);
            }
            if (endDate) {
                countQuery += ` AND order_info.order_time <= ?`;
                countParams.push(endDate);
            }
            if (name) {
                countQuery += ` AND customers.name LIKE ?`;
                countParams.push(`%${name}%`);
            }
            if (orderNumber) {
                countQuery += ` AND order_info.order_number LIKE ?`;
                countParams.push(`%${orderNumber}%`);
            }
            if (storeName) {
                countQuery += ` AND order_info.store_name LIKE ?`;
                countParams.push(`%${storeName}%`);
            }
            if (deliveryPerson) {
                countQuery += ` AND order_info.delivery_person LIKE ?`;
                countParams.push(`%${deliveryPerson}%`);
            }
    
            db.query(countQuery, countParams, (err, countResult) => {
                if (err) {
                    return res.status(500).send('총 주문 수를 가져오는 중 오류가 발생했습니다.');
                }
    
                const totalOrders = countResult[0].count;
                const totalPages = Math.ceil(totalOrders / limit);
    
                res.render('home/order_list', {
                    orders: result,
                    currentPage: page,
                    totalPages: totalPages,
                    limit: limit,
                    totalOrders: totalOrders,
                    status: status,
                    start_date: startDate,
                    end_date: endDate,
                    name: name,
                    order_number: orderNumber,
                    store_name: storeName,
                    delivery_person: deliveryPerson,  // 배달 기사 이름 전달
                    sort_by: sortBy,  // 정렬 기준 전달
                    session: req.session
                });
            });
        });
    }],
    
    
    
    
    signup: (req, res) => {
        res.render("home/signup",{ session: req.session });
    },
};

const process = {
    login: async (req, res) => {
        const user = new User(req.body);
        const response = await user.login();
        if (response.success) {
            // 로그인 성공 시 세션에 사용자 정보를 저장
            req.session.user = {
                id: req.body.id,
                name: response.name, // 추가로 필요한 정보가 있다면 여기에 포함
            };

            console.log("로그인 후 세션 정보:", req.session);
        }
        return res.json(response);
    },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error("로그아웃 중 오류 발생:", err);
                return res.status(500).send("로그아웃 중 오류가 발생했습니다.");
            }
            res.redirect("/login");  // 로그아웃 후 로그인 페이지로 이동
        });
    },


    signup: async (req, res) => {
        const user = new User(req.body);
        const response = await user.signup();
        return res.json(response);
    },

    order_entry: async (req, res) => {
        if (!req.session.user) {
            return res.status(400).json({ success: false, msg: "로그인이 필요합니다." });
        }
        const customer = new Customer(req.body,req.session.user);
        const response = await customer.order_entry();
        return res.json(response);
    },

    editCustomer: async (req, res) => {
        const customerIdx = req.body.customerIdx;
        const customerData = {
            name: req.body.name,
            phone_number: req.body.phone_number,
            address: req.body.address
        };

        try {
            const response = await CustomerStorage.update(customerIdx, customerData);
            return res.json(response);
        } catch (err) {
            console.error("고객 정보 수정 중 서버 오류:", err); // 더 구체적인 오류 출력
        return res.status(500).json({ success: false, msg: "고객 정보 수정 중 오류가 발생했습니다." });
    }
    },
    getCustomer: async (req, res) => {
        const customerIdx = req.params.id;  // URL에서 고객 ID 추출
        
        const query = `SELECT * FROM customers WHERE idx = ?`;
        db.query(query, [customerIdx], (err, result) => {
            if (err) {
                console.error(`고객 정보 가져오기 오류: ${err}`);
                return res.status(500).send("고객 정보를 가져오는 중 오류가 발생했습니다.");
            }

            if (result.length === 0) {
                return res.status(404).send("해당 고객을 찾을 수 없습니다.");
            }

            res.json(result[0]);  // 고객 정보를 JSON 형식으로 반환
        });
    },

    deleteOrder: async (req, res) => {
        const orderNumber = req.body.order_number;  // 삭제할 주문 번호
        const query = `DELETE FROM order_info WHERE order_number = ?`;
        
        db.query(query, [orderNumber], (err, result) => {
            if (err) {
                console.error(`주문 삭제 중 오류: ${err}`);
                return res.status(500).json({ success: false, msg: "주문 삭제 중 오류가 발생했습니다." });
            }

            return res.sendStatus(200);  
        });
    },
};

module.exports = {
    output,
    process,
};
