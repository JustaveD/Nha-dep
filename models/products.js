const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nhadep'
 });

class Products {
    constructor(){

    }

    static getProductDetailById = (id,cb)=>{
        let sql = "SELECT * from products where id = ?";
        db.query(sql,id,(err,data)=>{
            if(err) throw err;
            cb(data);
        })
    }

    static getAllProduct =(cb=>{
        let sql = `SELECT * from products limit 12`;
        db.query(sql,(err,data)=>{
            if(err) throw err;
            cb(data);
        })
    })
    static searchList =((query,cb)=>{
        query = `%${query}%`;
        let sql = `SELECT * from products where name LIKE ? limit 12`;
        db.query(sql,query,(err,data)=>{
            if(err) throw err;
            cb(data);
        })
    })

    static getNewProduct = (cb=>{
        let sql = `SELECT * from products order by time desc limit 12`;
        db.query(sql,(err,data)=>{
            if(err) throw err;
            cb(data);
        })
    })

    static getHighViewProduct = (cb=>{
        let sql = `SELECT * from products order by views desc limit 12`;
        db.query(sql,(err,data)=>{
            if(err) throw err;
            cb(data);
        })
    })
    static getHotProduct = (cb=>{
        let sql = `SELECT * from products order by orders desc limit 12`;
        db.query(sql,(err,data)=>{
            if(err) throw err;
            cb(data);
        })
    })

    static getAllProductsByItemsSlug = (slug,cb) =>{
        let sql = `SELECT cat_items_id,cat_areas_id,name from cat_items where slug = '${slug}'`;
        db.query(sql,(err,data1)=>{
            if(err) throw err;
            sql = `SELECT name, slug from cat_areas where cat_areas_id = ${data1[0].cat_areas_id}`;
            db.query(sql,(err,data2)=>{
                if(err) throw err;
                sql = `SELECT * from products where cat_items_id = ${data1[0].cat_items_id} and cat_areas_id = ${data1[0].cat_areas_id}`;
                db.query(sql,(err,data)=>{
                    if(err) throw err;
                    cb(data,data2,data1);
                })
            })
        }) 
    }
    static getProductDetailBySlug = (slug,cb)=>{
        let sql = `SELECT * from products where slug = '${slug}'`;
        db.query(sql,(err,data1)=>{
            // data1 = JSON.parse(JSON.stringify(data1))
            sql = `select name, slug from cat_areas where cat_areas_id = ${data1[0].cat_areas_id}`;
            db.query(sql,(err,data2)=>{
                if(err) throw err;
                // data2 = JSON.parse(JSON.stringify(data2))
                sql = `select name, slug from cat_items where cat_items_id = ${data1[0].cat_items_id}`;
                db.query(sql,(err,data3)=>{

                    if(err) throw err;
  
                    cb(data1,data2,data3);
                })
            })
        })
    }

    static getAllProduct = (cb) =>{
        let sql = "SELECT * from products limit 12";
        db.query(sql, (err,data)=>{
            if(err) throw err;
            cb(data);
        })
    }
    static getAllProductByCatAreas = (id,cb) =>{
    
        let sql = `SELECT * FROM products where cat_areas_id = ${id}`;
        db.query(sql,(err,data)=>{
            if(err) throw err;
            cb(data);
        })
    }
    static getBanner = (cb)=>{
        let sql = `SELECT * FROM banner`;
        db.query(sql,(err,data)=>{
            if(err) throw err;
            cb(data);
        })
    }

    static getCatItemsProductsById = (id,cb)=>{
        let sql = "SELECT * FROM products where cat_items_id = ?";
        db.query(sql,id,(err,data)=>{
            if(err) throw err;
            cb(data);
        })
    }
}

module.exports = Products;