const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nhadep'
 });

class CatAreas {
    constructor(){

    }

    static getCatAreasBySlug = (slug,cb)=>{
        let sql = "SELECT * from cat_areas where slug = ?";
        db.query(sql,slug,(err,data)=>{
            if(err) throw err;
            cb(data);
        })
    }
    static getCatAreasById = (id,cb)=>{
        let sql = "SELECT * from cat_areas where cat_areas_id = ?";
        db.query(sql,id,(err,data)=>{
            if(err) throw err;
            cb(data);
        })
    }
    static getItemNameById = (id,cb)=>{
        let sql = "SELECT * from cat_items where cat_items_id = ?";
        db.query(sql,id,(err,data)=>{
            if(err) throw err;
            cb(data);
        })
    }
    static getCatItemBySlug = (slug,cb)=>{
        let sql = "SELECT * from cat_items where slug = ?";
        db.query(sql,slug,(err,data)=>{
            if(err) throw err;
            cb(data);
        })
    }

    static getAllCatAreas = (cb)=>{
        let sql = "SELECT * from cat_areas";
        db.query(sql,(err,data)=>{
            if(err) throw err;
            cb(data);
        })
    }
    static getAllCatItems = (id,cb)=>{
        let sql = "SELECT * from cat_items where cat_areas_id = ?";
        db.query(sql,id,(err,data)=>{
            if(err) throw err;
            cb(data);
        })
    }
    static getAllCatItemByAreas = (slug,cb) =>{
        let sql = `SELECT cat_areas_id,name,slug from cat_areas where slug = '${slug}'`;
        db.query(sql,(err,data1)=>{
            if(err) throw err;
           
            sql = `SELECT * from cat_items where cat_areas_id = ${data1[0].cat_areas_id}`;
            db.query(sql,(err,data)=>{
                if(err) throw err;
                cb(data,data1);
            })
        }) 
    }
}

module.exports = CatAreas;