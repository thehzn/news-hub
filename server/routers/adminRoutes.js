const express = require("express");
const { userRegister, userLogin, getMe, changePassword, signout, getStats } = require("../controllers/adminControllers");
const { userAuthenticate } = require("../middleware/auth");


const router=express.Router();

router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/getstats").get(userAuthenticate,getStats);
router.route("/getme").get(userAuthenticate,getMe);
router.route("/changepass").post(userAuthenticate,changePassword);
router.route("/signout").post(userAuthenticate,signout);

module.exports=router;