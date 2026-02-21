import Notification from "../models/notification.js";

export const getNotifications = async (req,res) =>{
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({to: userId}).populate({
            path:"from",
            select:"username profileimg",
         });

         await Notification.updateMany({to: userId},{read:true});
         res.status(200).json(notifications);
        
    } catch (error) {
        console.log("Error in get notification :",error.message);
        res.status(500).json({msg:"Internal Server Error"});
    }
}

export const deleteNotification = async (req,res) =>{
    try {
        const userId = req.user._id;
        await Notification.deleteMany({to: userId});
        res.status(200).json({msg:"All notifications deleted successfully"});
    } catch (error) {
        console.log("Error in delete notification :",error.message);
        res.status(500).json({msg:"Internal Server Error"});
    }
}