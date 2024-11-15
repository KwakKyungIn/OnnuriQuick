"use strict";
const db = require("../config/db");

class UserStorage {

    static getUsers(isAll,...fields) {

    }

    static getUserInfo(id){
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM users WHERE id = ?;";
            db.query(query,[id], (err, data)=> {
                if(err) reject(e`${err}`);
                resolve(data[0]);
        });
       
            
        });
    }
  

    static async save(userInfo){
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO users(id, name, password,person_name, store_address) VALUES(? ,? ,? ,?,?);";
            db.query(query,[userInfo.id, userInfo.name, userInfo.password,userInfo.person_name,userInfo.store_address] , (err)=> {
            if(err) reject(`${err}`);
                resolve({ success : true});
                
        });
       
            
        });
            
           
    }
       
    }

    


module.exports = UserStorage;