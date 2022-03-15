const CatAreas = require("../models/catAreas");
const Products = require("../models/products");

module.exports.getHomePage = (req,res,next)=>{
    res.render("index");
};
module.exports.getShopPage = (req,res,next)=>{
    res.render("shop.ejs");
};

module.exports.getCatAreasPage = (req,res,next)=>{
    res.render("shop-cat-areas.ejs");
}
module.exports.getCatItemsPage = (req,res,next)=>{
    res.render("shop-cat-items.ejs");

}
module.exports.getProductDetail = (req,res,next)=>{
    res.render("product-detail.ejs");
}
module.exports.getAboutPage = (req,res,next)=>{
    res.render("about.ejs");
}
module.exports.getAccountPage = (req,res,next)=>{
    res.render("account.ejs");
}
module.exports.getContactPage = (req,res,next)=>{
    res.render("contact.ejs");
}
module.exports.getSearchPage = (req,res,next)=>{
    res.render("search.ejs");
}

