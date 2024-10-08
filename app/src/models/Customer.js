"use strict";

const CustomerStorage = require("./CustomerStorage")
class Customer{
    constructor(body){
        this.body = body;
    }
    
        async order_entry(){
            const client = this.body;
            try{
                const response = await CustomerStorage.save(client);
                return response;
                
            }catch(err){
         
                return {success : false, msg : `에러 발생: ${err}`};
                
              
            }
            
            }
            

}
module.exports = Customer;