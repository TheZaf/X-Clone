import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import notificationRoutes from "./routes/notification.route.js"

import path from "path"
import dotenv from "dotenv"
import connectDB from "./db/db.js"
import cookieParser from "cookie-parser"

const app = express()
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();// Enable CORS for all routes
app.use(cors({
  origin: "http://localhost:8000", // your React app's port
  credentials: true,               // allow cookies/auth if needed
}));
dotenv.config()
// v2.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,  
// })

// const cors = require('cors');

 // Use this after the variable declaration
app.use(cookieParser());
app.use(express.json({limit:"2mb"}));//parse the req.body
app.use(express.urlencoded({extended:true}));//parse the req.body

app.use("/api/auth/",authRoutes)
app.use("/api/user/",userRoutes)
app.use("/api/posts/",postRoutes)
app.use("/api/notifications/",notificationRoutes)


if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"/frontend/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
    })
}

app.listen(PORT,()=>{
    connectDB()
    console.log("server is running on port",PORT);
})