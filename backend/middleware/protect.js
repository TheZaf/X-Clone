import User from "../models/user.js";
import jwt from "jsonwebtoken";



export const protectRoute = async (req,res,next) =>{
    // console.log("Cookies:", req.cookies);
    // console.log("Headers:", req.headers);
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({error:"Unathorized : No Token Provided"});
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({error:"Unathorized : Invalid Token"});
        } 

        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({error:"User not found"});
        }

        req.user=user;
        next()
    } catch (error) {
        console.log("Error in the proctectRoute",error);
        res.status(500).json({message:"Internal Server Error"})    
    }
}