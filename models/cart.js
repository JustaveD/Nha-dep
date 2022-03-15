const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nhadep'
 });

class Cart {
     constructor(){};
     static addToCart = (data,cb)=>{
        let sql = "SELECT * from cart where userId = ? and productId = ?";
        db.query(sql,[data.userId,data.productId],(err,res)=>{
            if(err) throw err;
            if(res.length >0){
               
                let qty = parseInt(data.qty) + parseInt(res[0].qty);
                
                let sql = "update cart set qty = ? where id = ?";
                db.query(sql,[qty,res[0].id],(err,data)=>{
                    if(err) throw err;
                    cb(data);
                })
            }else{
                let sql = "Insert into cart SET ?";
                db.query(sql,data,(err,data)=>{
                    if(err) throw err;
                    cb(data);
                })
            }
        })
       
     }

     static loadCart =(userId,cb)=>{
         let sql = 'SELECT * from cart where userId = ?';
         db.query(sql,userId,(err,data)=>{
             if(err) throw err;
             cb(data);
         })
     }
     static deleteCart =(id,userId,cb)=>{
         let sql = 'delete from cart where id = ? and userId = ?';
         db.query(sql,[id,userId],(err,data)=>{
             if(err) throw err;
             cb(data);
         })
     }
}

module.exports = Cart;
