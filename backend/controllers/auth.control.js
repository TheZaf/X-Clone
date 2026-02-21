import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { genearateTokenAndSetCookie } from "../lib/utild/generateToken.js";

export const signup = async (req,res) =>{
   try {
      let {fullName,username,email,password} = req.body;
      console.log("📩 Incoming signup data:", req.body);

        const existUser = await User.findOne({ username });
        if(existUser) return res.status(400).send("Username already exists"); 

        const existEmail = await User.findOne({ email });
        if(existEmail)  return res.status(400).send("Email already exists");

        if(password.length < 6) return res.status(400).json({error:"Password must be at least 6 characters"});

        if(!fullName || !username || !email || !password) return res.status(400).json({error:"All fields are required"});

        //Hash the password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        
        //Create a new user object (not saved yet).
        const newUser = new User({
            fullName,
            username,
            email,
            password:hashedPassword,
        });
        
        //If user created: Generate a JWT token and set it as cookie.,

        if(newUser){
            genearateTokenAndSetCookie(newUser._id,res)
            await newUser.save(); //save the user to the database
            res.status(201).json({//return the user data except password
                _id:newUser._id,
                username:newUser.username,
                email:newUser.email,
                followers:newUser.followers,
                following:newUser.following,
                profileImg:newUser.profileImg,
                coverImg:newUser.coverImg,
                bio:newUser.bio,
                link:newUser.link,
            });  
        }else{
            res.status(400).send("Invalid User Data"); 
        }
   } catch (error) {
    console.log("Error in the signup controller",error);
    res.status(500).send("Internal Server Error") 
   }
}

export const login = async (req,res) =>{
   try {
    const {username,password} = req.body;
    const user = await User.findOne({ username });
    const isPasswordValid = await bcrypt.compare(password, user?.password || "");

    if(!user || !isPasswordValid){
        res.status(400).json({error:"Invalid username or password"})
    }
    genearateTokenAndSetCookie(user._id,res);

    res.status(200).json({
        _id:user._id,
        username:user.username,
        email:user.email,
        followers:user.followers,
        following:user.following,
        profileimg:user.profileimg,
        coverimg:user.coverimg,
        bio:user.bio,
        link:user.link,
    })
    
   } catch (error) {
    console.log("Error in the login controller",error);
    res.status(500).json({message:"Internal Server Error"}) 
   }
}

export const logout = async (req,res) =>{
   try {
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"Logged out successfully"})
   } catch (error) {
    console.log("Error in the logout controller",error);
    res.status(500).json({message:"Internal Server Error"}) 
   }
}

export const getMe = async (req,res) =>{
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in the getme controller",error);
        res.status(500).json({message:"Internal Server Error"})    
    }
}
 