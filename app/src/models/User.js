"use strict";
const bcrypt = require("bcrypt");
const UserStorage = require("./UserStorage")
class User{
    constructor(body){
        this.body = body;
    }

    async login() {
        const client = this.body;
        const user = await UserStorage.getUserInfo(client.id);

        if (user) {
            const validPassword = await bcrypt.compare(client.password, user.password);
            if (validPassword) {
                // 로그인 성공 시 사용자 이름 반환
                return { success: true, name: user.name };  // name 값을 반환
            }
            return { success: false, msg: "비밀번호가 틀렸습니다." };
        }
        return { success: false, msg: "존재하지 않는 아이디입니다." };
    }




    async signup() {
        const client = this.body;

        // 비밀번호 해시화
        try {
            const saltRounds = 10; // salt 길이
            const hashedPassword = await bcrypt.hash(client.password, saltRounds);
            client.password = hashedPassword; // 해시화된 비밀번호로 대체
            const response = await UserStorage.save(client);
            return response;
        } catch (err) {
            return { success: false, msg: "비밀번호 해시화 중 오류가 발생했습니다." };
        }
    }

       

}
module.exports = User;