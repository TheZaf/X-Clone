import { populate } from "dotenv";
import Notification from "../models/notification.js";
import Post from "../models/post.js";
import User from "../models/user.js"
import cloudinary from "../lib/utild/cloudinary.js";

export const createPost = async (req,res) => {

     try { 
        const {text} = req.body; 
        let {img} = req.body; 
        const userId = req.user._id.toString(); 
        const user = await User.findById(userId); 

        if(!user) return res.status(400).json({msg:"User not found"}); 
        if(!text && !img) return res.status(400).json({msg:"Please add text or image"}); 
        if(img) { 
            const uploadedResponse = await cloudinary.uploader.upload(img); 
            img = uploadedResponse.secure_url; 
        } 
        const newPost = new Post({ user:userId, text, img, });
        await newPost.save(); 
        res.status(201).json(newPost); 
        } 
    catch (error) { 
        res.status(500).json({msg:"Internal Server Error"}); 
        console.log("Error in post :",error.message); 
    } 
} 

export const deletePost = async (req,res) =>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({msg:"Post not found"});

        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({error:"you are not authorized to delete this post"});
        }

        if(post.img){
            const imgId = post.img.split("/").pop();
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({msg:"Post deleted successfully"});
    } catch (error) {
        res.status(500).json({msg:"Internal Server Error"});
        console.log("Error in delete post :",error.message);
    }
}

export const commentPost = async (req,res) =>{
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if(!text) return res.status(400).json({error:"text field is required"});

        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({error:"Post not found"});

        const comment = {user:userId,text};
        post.comments.push(comment);
        await post.save();

        res.status(201).json(post);
    } catch (error) {
        console.log("Error in comment post :",error.message);
        res.status(500).json({msg:"Internal Server Error"});
    }
}

export const likePost = async (req,res) =>{
    try {
        const userId = req.user._id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({msg:"Post not found"});

        const userLikedPost = post.likes.includes(userId);

        if(userLikedPost){//unlike post
            await Post.updateOne({_id:postId},{$pull:{likes:userId}});
            await User.updateOne({_id:userId},{$pull:{likedPosts:postId}});
            
            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
            res.status(200).json(updatedLikes);
        }else{//like post
            post.likes.push(userId);
            await User.updateOne({_id:userId},{$push:{likedPosts:postId}});
            await post.save();

            const notification = new Notification({
                from:userId,
                to:post.user,
                type:"like",
            });
            await notification.save();
            res.status(201).json(post.likes);
        }
    } catch (error) {
        console.log("Error in like post :",error.message);
        res.status(500).json({msg:"Internal Server Error"});    
    }
}

export const getLikedPosts = async (req,res) =>{
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({msg:"User not found"});

        const likedPosts = await Post.find({_id:{$in:user.likedPosts}})
        .populate({
            path:"user",
            select:"-password",
        })
        .populate({
            path:"comments.user",
            select:"-password",
        })
          res.status(200).json(likedPosts);
    } catch (error) {
        console.log("Error in get liked post :",error.message);
        res.status(500).json({msg:"Internal Server Error"});
    }

}

export const getAllPosts = async (req,res) =>{
    try{
        const post = await Post.find().sort({createdAt:-1}).populate({
            path:"user",
            select:"-password",
        }).populate({
            path:"comments.user",
            select:"-password",
        });

        if(post.length ===0) return res.status(200).json({msg:"No post found"});

        res.status(200).json(post);

    }catch(error){
       console.log("Error in get all post :",error.message);
       res.status(500).json({msg:"Internal Server Error"}); 
    }
}

export const getFollowingPosts = async (req,res) =>{
    try {
        const userId = req.user._id;
        const user= await User.findById(userId);
        if(!user) return res.status(404).json({error:"User not found"});

        const folowing = user.following;
        const feedPosts = await Post.find({user:{$in:folowing}})
        .sort({createdAt:-1})
        .populate({
            path:"user",
            select:"-password",
        })
        .populate({
            path:"comments.user",
            select:"-password",
        });
        res.status(200).json(feedPosts);
    } catch (error) {
        console.log("Error in get following post :",error.message);
        res.status(500).json({msg:"Internal Server Error"});
    }
}

export const getUserPosts = async (req,res) =>{
    try {
        const { username } = req.params;
        const user = await User.findOne({username});
        if(!user) return res.status(404).json({msg:"User not found"});

        const posts = await Post.find({user:user._id}).sort({createdAt:-1}).populate({
            path:"user",
            select:"-password",
        }).populate({
            path:"comments.user",
            select:"-password",
        })
        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in get user post :",error.message);
        res.status(500).json({msg:"Internal Server Error"});
    } 
}