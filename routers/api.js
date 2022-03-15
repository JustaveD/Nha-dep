const express = require("express");

const router = express.Router();
const apiController = require("../controllers/api");

router.get("/items/list/:id",apiController.getItems);
router.get("/items/:slug",apiController.getItemsNameBySlug);

router.get("/items/id/:id",apiController.getItemNameById);

router.get("/areas/list",apiController.getAreas);

router.get("/areas/:slug",apiController.getAreasNameBySlug);

router.get("/areas/id/:id",apiController.getAreasNameByid);

router.get("/product/list",apiController.listProduct);

router.get("/product/search/:query",apiController.searchList);

router.get("/product/new",apiController.newProduct);

router.get("/product/high-view",apiController.highViewProduct);

router.get("/product/hot",apiController.hotProduct);

router.get("/product/detail/:slug",apiController.detailProduct);

router.get("/product/detail/id/:id",apiController.detailProductById);

router.get("/product/areaProduct/:slug",apiController.areaProduct);

router.get("/product/itemProduct/:id",apiController.itemProduct);

router.get("/product/banner",apiController.getBanner);

router.post("/cart/add",apiController.addToCart);

router.get("/cart/load",apiController.loadCart);

router.delete("/cart/delete/:id",apiController.deleteCart);


module.exports = router;
