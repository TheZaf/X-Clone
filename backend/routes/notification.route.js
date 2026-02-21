import express from "express"
import { protectRoute } from "../middleware/protect.js";
import { getNotifications ,deleteNotification} from "../controllers/notification.control.js";

const router = express.Router();

router.get("/",protectRoute,getNotifications)
router.delete("/",protectRoute,deleteNotification)

export default router;