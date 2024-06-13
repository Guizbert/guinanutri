import mongoose from "mongoose";
import User from "./user.model.js";

const moduleSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        min: 3,
        max: 50,
        unique: true,
    },
    description:{
        type: String,
        required: true,
        min: 3,
        max: 50
    },
    price:{
        type: Number,
    },
    videos: [{
        type: mongoose.Types.ObjectId,
        ref: 'Video',
        required: true
    }],
    tag: [{
        type: mongoose.Types.ObjectId,
        ref: 'Tag',
        required: true
    }],
    isPublished:{
        type:Boolean,
        default: false,
    },
    creator:{
        type:mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    users:[{
        type:mongoose.Types.ObjectId,
        ref: 'User',
    }],

    form: [{
        type: mongoose.Types.ObjectId,
        ref: 'Form',
    }],
})


const Module = mongoose.model('Module', moduleSchema);

export default Module;