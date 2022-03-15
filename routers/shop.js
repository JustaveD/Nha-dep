const express = require("express")

const router = express.Router();

const shopController = require("../controllers/shop");

router.get("/",shopController.getHomePage);

router.get("/shop",shopController.getShopPage);

router.get("/areas",shopController.getCatAreasPage);

router.get("/items",shopController.getCatItemsPage);

router.get("/detail",shopController.getProductDetail);

router.get("/about",shopController.getAboutPage);

router.get("/account",shopController.getAccountPage);

router.get("/contact",shopController.getContactPage);

router.get("/search",shopController.getSearchPage);


module.exports = router;