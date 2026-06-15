const express=require("express");
const { getPublicFeed, getPublicFeedPostById, createPost, updatePost, getPosts, deletePost, getPostById } = require("../controllers/newsControllers");
const { userAuthenticate } = require("../middleware/auth");

const router =express.Router();

router.route("/getposts").get(getPublicFeed);
router.route("/getpostbyid/:id").get(getPublicFeedPostById);
router.route("/create").post(userAuthenticate,createPost);
router.route("/update/:id").put(userAuthenticate,updatePost);
router.route("/myposts").get(userAuthenticate,getPosts);
router.route("/getpost/:id").get(userAuthenticate,getPostById);
router.route("/delete/:id").delete(userAuthenticate,deletePost);

module.exports = router;