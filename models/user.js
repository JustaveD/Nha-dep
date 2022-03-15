const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nhadep'
 });

class User {
    constructor(){};
    static getUser = (email)=>{
        
           
                return new Promise(
                    (resolve, reject) => {
                        let sql = "SELECT * from users where email = ?";
                
                        db.query(sql,email,(err,data)=>{
                            if(err) {reject(err); return};
                            data = JSON.parse(JSON.stringify(data));
                           
                            resolve(data);
                            
                        })
                    })

           
        
    }

    static resetpassword = (email,hashPassword)=>{
        return new Promise(
            (resolve, reject) => {
                let sql = "update users set otp = null, password = ? where email = ?";
        
                db.query(sql,[hashPassword,email],(err,data)=>{
                    if(err) {reject(err); return};
                    data = JSON.parse(JSON.stringify(data));
                    resolve(data);
                })
            })
    }

    static saveOTP = (email,otp)=>{
        return new Promise(
            (resolve, reject) => {
                let sql = "update users set otp = ? where email = ?";
        
                db.query(sql,[otp,email],(err,data)=>{
                    if(err) {reject(err); return};
                    data = JSON.parse(JSON.stringify(data));
                   
                    resolve(data);
                    
                })
            })
    }
    static createUser(user){
        
            return new Promise((resolve,reject)=>{

                let sql = "insert into users SET ?";

                db.query(sql,user,(err,data)=>{
                    if(err) {
                        resolve(null);
                    };
                    data = JSON.parse(JSON.stringify(data));
                    resolve(data);
                })
            })
        
    }
    static updateRefreshToken= (email,refreshToken)=>{
        return new Promise((resolve,reject)=>{

            let sql = "update users SET refreshToken = ? where email =?";

            db.query(sql,[refreshToken,email],(err,data)=>{
                if(err) {
                    resolve(null);
                };
                data = JSON.parse(JSON.stringify(data));
                resolve(data);
            })
        })
    }
    static verifyEmail = (email)=>{
        return new Promise((resolve,reject)=>{

            let sql = "update users SET verify = 1 where email =?";

            db.query(sql,email,(err,data)=>{
                if(err) {
                    resolve(null);
                };
                data = JSON.parse(JSON.stringify(data));
                resolve(data);
            })
        })
    }
}

module.exports = User;