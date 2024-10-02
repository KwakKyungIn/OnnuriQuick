"use strict";

const User = require("../../models/User");
const Customer = require("../../models/Customer");

const isLoggedIn = require("../../middleware/authMiddleware"); 
const db = require("../../config/db");

const output = {
    home: (req, res) => {
        res.render("home/index", { session: req.session });
    },
    
    login: (req, res) => {
        res.render("home/login",{ session: req.session });
    },
    
    customer_list: [isLoggedIn, (req, res) => {  // 로그인 확인 미들웨어 추가
        const limit = parseInt(req.query.limit) || 10;  // 한 페이지당 고객 수 (기본값: 10)
        const page = parseInt(req.query.page) || 1;     // 현재 페이지 (기본값: 1)
        const offset = (page - 1) * limit;

        const customerInfo = req.query.customer_info || '';  // 고객명
        const phoneNumber = req.query.phone_number || '';    // 휴대폰 번호

        // 검색 조건 추가
        let query = `SELECT * FROM customers WHERE 1=1`;  // 기본 쿼리
        let queryParams = [];

        if (customerInfo) {
            query += ` AND name LIKE ?`;
            queryParams.push(`%${customerInfo}%`);
        }

        if (phoneNumber) {
            // 전화번호 형식에 맞는지를 체크하고 쿼리 실행
            if (/^\d+$/.test(phoneNumber)) {  // 번호가 숫자 형식인 경우
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
            let countQuery = `SELECT COUNT(*) AS count FROM customers WHERE 1=1`;
            let countParams = [];

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
    
    order_entry: [isLoggedIn, (req, res) => {  // 로그인 확인 미들웨어 추가
        res.render("home/order_entry",{ session: req.session });
    }],
    
    order_list: [isLoggedIn, (req, res) => {  // 로그인 확인 미들웨어 추가
        res.render("home/order_list",{ session: req.session });
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
        const customer = new Customer(req.body);
        const response = await customer.order_entry();
        return res.json(response);
    },
};

module.exports = {
    output,
    process,
};
