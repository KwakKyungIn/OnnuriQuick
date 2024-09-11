"use strict";

class UserStorage {
    static #users = {
        id : ["admin", "bmule"],
        password : ["1234", "5113"],
        name : ["관리자", "개발자"],
    };

    static getUsers(...fields) {
        const users = this.#users;
        const newUsers = fields.reduce((newUsers,field) => {
            if(users.hasOwnProperty(field)){
                newUsers[field] = users[field];
            }
            return newUsers;
        },{});
        return newUsers;
    }

    static getUsersInfo(id){
        const users = this.#users;
        const idx = users.id.indexOf(id);
        const userKeys = Object.keys(users); //=>[id, password, name]
        const userInfo = userKeys.reduce((newUser, info)=>{
            newUser[info]=users[info][idx];
            return newUser;
        },{});
        return userInfo;
    }

    

}
module.exports = UserStorage;