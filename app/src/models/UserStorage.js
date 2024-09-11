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

}
module.exports = UserStorage;