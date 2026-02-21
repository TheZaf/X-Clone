import bcrypt from 'bcryptjs';
import { v2 } from 'cloudinary';
import User from '../models/user.js';
import dotenv from 'dotenv';
import Notification from '../models/notification.js';


export const getUserProfile = async (req,res) =>{
    const{ username } = req.params;
    try {
        const user = await User.findOne({ username }).select("-password");
        if(!user) return res.status(404).json({error:"User not found"});
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getUserProfile",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}

export const followunfollowUser = async (req,res) =>{  
    try {
        const { id } = req.params; 
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if(id === req.user._id.toString()) return res.status(400).json({error:"you can't follow/unfollow yourself"});

        if(!userToModify || !currentUser) return res.status(404).json({error:"User not found"});

        const isfollowing = currentUser.following.includes(id);

        if (isfollowing) {
            //to unfollow
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            //to follow
            await User.findByIdAndUpdate(id,{ $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id,{ $push: { following: id } });
            //send the notification to the user
            const newNotification = new Notification({
                from: req.user._id,
                to: userToModify._id,
                type: "follow"
            });

            await newNotification.save();
            res.status(200).json({ message: "User followed successfully" });
            
        }
    } catch (error) {
        console.log("Error in follow",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}

export const getsuggestedUsers = async (req,res) =>{
    try {
        const userId = req.user._id;
        const userFollowedByMe = await User.findById(userId).select("following");
        const users = await User.aggregate([
            {
                $match:{
                    _id: { $ne: userId }
                },        
            },
            {$sample: {size:10} },
            { $project: { password: 0, email: 0, /* keep username, fullname, profileImg etc. */ } }
        ]);

        const filteredUsers = users.filter((user) => !userFollowedByMe.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0,4);
        res.status(200).json(suggestedUsers)
    } catch (error) {
        console.log("Error in follow",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}

export  const updateUser = async (req,res) =>{ 
    let {fullName,email,bio,link,username,currentPassword,newPassword} = req.body;
    let {profileImg,coverImg} = req.body;

    let userId = req.user._id;

    try {

        console.log("req.body:", req.body);
        let user = await User.findById(userId);
        if(!user) return res.status(404).json({error:"User not found"});

        if (currentPassword && !newPassword || !currentPassword && newPassword) {
            return res.status(400).json({ error: "Please enter both current and new passwords" });
        }

        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword,user.password);
            if(!isMatch) return res.status(400).json({error:"Invalid Password"});
            if(newPassword.length < 6) return res.status(400).json({error:"Password must be atleast 6 characters long"});

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword,salt);
        }

        if(profileImg){
            if(user.profileImg){
                await v2.uploader.destroy(user.profileimg.split("/").slice(-1)[0]);
            }
            const uploadResponse = await v2.uploader.upload(profileImg);
            profileImg = uploadResponse.secure_url;   
        }
        if(coverImg){
            if(user.coverImg){
                await v2.uploader.destroy(user.coverImg.split("/").slice(-1)[0]);
            }
            const uploadResponse = await v2.uploader.upload(coverImg);
            coverImg = uploadResponse.secure_url;   
        }

        //“If the user sent a new field, use it. Otherwise, keep the existing one.”
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.username = username || user.username;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user= await user.save();
        user.password= null;

        return res.status(200).json(user);//this will return the updated user

    } catch (error) {
        console.log("Error in update",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
} 