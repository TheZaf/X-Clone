import jwt from "jsonwebtoken";

export const genearateTokenAndSetCookie = (userId,res) =>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d"
    });

    res.cookie("jwt",token,{
        httpOnly:true,//prevent xxs attack cross site scripting attacks
        maxAge:7*24*60*60*1000,
        sameSite:"none",
        // secure:process.env.NODE_ENV !== "development",
        secure:true,
        domain: "localhost" //added later 
    });
}
