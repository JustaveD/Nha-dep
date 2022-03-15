const express = require("express")

const router = express.Router();

const authenController = require("../controllers/authen");
const authenMiddleware = require("../middleware/authen");


router.get("/check",authenMiddleware.isAuthForApi)
router.get("/login",authenController.getLoginPage);
router.get("/forgot",authenController.getForgotPage);
router.get("/verify/:email",authenController.verifyEmail);
router.post("/register",authenController.registeringNewAccount);
router.post("/login",authenController.login);
router.post("/refresh",authenController.refreshAccessToken);
router.put("/sendOTP",authenController.sendOTP);
router.put("/resetpassword",authenController.resetpassword);

module.exports = router;