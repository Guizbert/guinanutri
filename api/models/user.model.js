import mongoose from "mongoose";
import Status from "./enum/status.js";

const notificationSchema = new mongoose.Schema({
    message: String,
    isRead: {
        type: Boolean,
        default: false,
    },
    recipient:{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    form: {
        type: mongoose.Types.ObjectId,
        ref: 'Form'
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    answerId: {
        type: mongoose.Types.ObjectId,
        ref: 'Answer'
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 25,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 50,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isTherapeute: {
        type: Boolean,
        default: false,
    },
    modules: [{
        type: mongoose.Types.ObjectId,
        ref: 'Module',
    }],
    formsCreated: [{
        type: mongoose.Types.ObjectId,
        ref: 'Form',
    }],
    scores: {
        type: Map,
        of: Number,
        default: {}
    },
    isActif: {
        type: String,
        enum: Status,
        default: Status.INACTIF,
    },
    emailToken: {
        type: String
    },
    isUsingGoogle: {
        type: Boolean,
        default: false
    },
    notifications: [notificationSchema]

}, { timestamps: true }); // pour le moment de la création / update du user

// mongo mettra le s a user a notre place 
const User = mongoose.model('User', userSchema);

export default User;