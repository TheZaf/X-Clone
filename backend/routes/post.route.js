import express from "express"

import { createPost ,
    deletePost,
    commentPost,
    likePost,
    getAllPosts,
    getLikedPosts, 
    getFollowingPosts,
    getUserPosts } 
    from "../controllers/post.control.js";
import { protectRoute } from "../middleware/protect.js";

const router = express.Router();

router.get("/all", protectRoute,getAllPosts);
router.get("/likes/:id", protectRoute,getLikedPosts);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likePost);
router.post("/comment/:id", protectRoute, commentPost);
router.delete("/:id", protectRoute, deletePost);
router.get("/following", protectRoute,getFollowingPosts);
router.get("/user/:username" ,protectRoute,getUserPosts)

export default router;