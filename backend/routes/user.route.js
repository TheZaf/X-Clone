import express from 'express'
import { getUserProfile , followunfollowUser,getsuggestedUsers,updateUser} from '../controllers/user.control.js';
import { protectRoute }from "../middleware/protect.js"


const route = express.Router();

route.get('/profile/:username',protectRoute, getUserProfile);
route.post("/follow/:id", protectRoute ,followunfollowUser);
route.get("/suggested",protectRoute,getsuggestedUsers);
route.put("/update",protectRoute,updateUser);

export default route;