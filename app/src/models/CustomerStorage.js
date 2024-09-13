"use strict";
const db = require("../config/db");

class CustomerStorage {

    static getCustomers(isAll,...fields) {

    }

    // static getCustomerInfo(customer_name){
    //     return new Promise((resolve, reject) => {
    //         const query = "SELECT * FROM customers WHERE id = ?;";
    //         db.query(query,[customer_name], (err, data)=> {
    //             if(err) reject(e`${err}`);
    //             resolve(data[0]);
    //     });
       
            
    //     });
    // }
  

    static async save(customerInfo){
        return new Promise((resolve, reject) => {
            
            const query = "INSERT INTO customers(name, phone_number, zipcode,address,extra_address,detail_address) VALUES(? ,? ,?,?,?,? );";
            db.query(query,[customerInfo.customer_name, customerInfo.phone_number, customerInfo.zipcode,customerInfo.address,customerInfo.extra_address,customerInfo.detail_address] , (err)=> {
            if(err) reject(`${err}`);
                resolve({ success : true});

               
                
   

        });
       
            
        });
            
           
    }
       
    }

    


module.exports = CustomerStorage;