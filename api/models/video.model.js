import mongoose, { mongo } from "mongoose";



const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min:3,
        max:50
    },
    description:{
        type: String,
        required: true,
        min: 3,
        max: 50
    },
    urlId:{
        type:String,
        required: true,
    },
    module:[{
        type: mongoose.Types.ObjectId,
        ref: 'Module',
    }],
})

const Video = mongoose.model('Video', videoSchema);

export default Video;
