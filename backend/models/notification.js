import moongoose from 'mongoose';

const notificationSchema = new moongoose.Schema({
    from:{
        type:moongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to:{
        type:moongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type:{
        type:String,
        required: true,
        enum: ['like','follow']
    },
    read:{
        type:Boolean,
        default: false
    }
},{timestamps: true});

const Notification = moongoose.model('Notification',notificationSchema);

export default Notification;