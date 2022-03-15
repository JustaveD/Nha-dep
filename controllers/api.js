const User = require('../models/user');
const Cart = require("../models/cart");

const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;

const verify = promisify(jwt.verify).bind(jwt);


const verifyToken = async (token, secretKey) => {
	try {
		return await verify(token, secretKey);
	} catch (error) {
		console.log(`Error in verify access token:  + ${error}`);
		return false;
	}
};

const Products = require("../models/products");
const CatAreas = require("../models/catAreas");

module.exports.listProduct = (req,res,next)=>{
    Products.getAllProduct((data)=>{
        res.json({
            data: data
        })
    })
}
module.exports.searchList = (req,res,next)=>{
    let query = req.params.query;
    Products.searchList(query,(data)=>{
        res.json({
            data: data
        })
    })
}


module.exports.newProduct = (req,res,next)=>{
    Products.getNewProduct((data)=>{
        res.send(data);
    })
}

module.exports.highViewProduct = (req,res,next)=>{
    Products.getHighViewProduct((data)=>{
        res.send(data);
    })
}
module.exports.hotProduct = (req,res,next)=>{
    Products.getHotProduct((data)=>{
        res.send(data);
    })
}
module.exports.detailProduct = (req,res,next)=>{
    let slug = req.params.slug;
    Products.getProductDetailBySlug(slug,(data,areas,item)=>{
        let result = {
            data: data,
            areas: areas,
            item: item
        }
        res.json(result);
    })
}
module.exports.detailProductById = (req,res,next)=>{
    let id = req.params.id;
    Products.getProductDetailById(id,(data)=>{
       
        res.json(data);
    })
}

module.exports.areaProduct = (req,res,next)=>{
    let slug =req.params.slug;
    CatAreas.getAllCatItemByAreas(slug,(data,catAreas)=>{
        id = catAreas[0].cat_areas_id;
        Products.getAllProductByCatAreas(id,(products)=>{

            res.json({
                allCatItems: data,
                catAreas: catAreas[0],
                products:products
            })
        })
    })
}
module.exports.itemProduct = (req,res,next)=>{
    let id =req.params.id;
    Products.getCatItemsProductsById(id,(data)=>{
        res.json(data);
    })
}

module.exports.getBanner = (req,res,next)=>{
    Products.getBanner((data)=>{
        res.send(data);
    })
}


module.exports.getAreas = (req,res,next)=>{
    CatAreas.getAllCatAreas((data)=>{
        res.json({
            "list": data
        })
    })
}
module.exports.getAreasNameBySlug = (req,res,next)=>{
    let slug = req.params.slug;
    CatAreas.getCatAreasBySlug(slug,(data)=>{
        res.json(data);
    })
}
module.exports.getAreasNameByid = (req,res,next)=>{
    let id = req.params.id;
    CatAreas.getCatAreasById(id,(data)=>{
        res.json(data);
    })
}
module.exports.getItemNameById = (req,res,next)=>{
    let id = req.params.id;
    CatAreas.getItemNameById(id,(data)=>{
        res.json(data);
    })
}
module.exports.getItemsNameBySlug = (req,res,next)=>{
    let slug = req.params.slug;
    CatAreas.getCatItemBySlug(slug,(data)=>{
        res.json(data);
    })
}

module.exports.getItems = (req,res,next)=>{
    let id = req.params.id;
    CatAreas.getAllCatItems(id,(data)=>{
        res.json({
            "list": data
        })
    })
}


module.exports.addToCart = async (req,res,next)=>{
    
    let accessToken = req.headers.x_authorization;
    if(!accessToken){
        return res.json({
            type:false,
            msg:'Không tìm thấy access token'
        })
    }
    let secretKey = process.env.ACCESS_TOKEN_SECRET;
    let validToken = await verifyToken(accessToken,secretKey);

    if(!validToken){
        return res.json({
            type:false,
            msg:'Access token không hợp lệ'
        })
    }

    const user = await User.getUser(validToken.payload.email);

    let userId = user[0].id;
    let productId = req.body.productId;
    let qty = req.body.qty;


    let data={
        userId,
        productId,
        qty
    }
    Cart.addToCart(data,(data)=>{
        res.json({
            type:true,
            msg:'Đã thêm vào giỏ hàng thành công!',
            data
        })
    })
}
module.exports.loadCart = async (req,res,next)=>{
    
    let accessToken = req.headers.x_authorization;
    if(!accessToken){
        return res.json({
            type:false,
            msg:'Không tìm thấy access token'
        })
    }
    let secretKey = process.env.ACCESS_TOKEN_SECRET;
    let validToken = await verifyToken(accessToken,secretKey);

    if(!validToken){
        return res.json({
            type:false,
            msg:'Access token không hợp lệ'
        })
    }

    const user = await User.getUser(validToken.payload.email);

    let userId = user[0].id;
   
    Cart.loadCart(userId,(data)=>{
        res.json({
            type:true,
            msg:'Load giỏ hàng thành công!',
            data
        })
    })
}
module.exports.deleteCart = async (req,res,next)=>{
    
    let accessToken = req.headers.x_authorization;
    let id = req.params.id;
    if(!accessToken){
        return res.json({
            type:false,
            msg:'Không tìm thấy access token'
        })
    }
    let secretKey = process.env.ACCESS_TOKEN_SECRET;
    let validToken = await verifyToken(accessToken,secretKey);

    if(!validToken){
        return res.json({
            type:false,
            msg:'Access token không hợp lệ'
        })
    }

    const user = await User.getUser(validToken.payload.email);

    let userId = user[0].id;
   
    Cart.deleteCart(id,userId,(data)=>{
        res.json({
            type:true,
            msg:'Xoá sản phẩm khỏi giỏ hàng thành công!',
            data
        })
    })
}