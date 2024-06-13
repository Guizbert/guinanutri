import mongoose from "mongoose";


const userChoiceSchema = new mongoose.Schema({
    question:{
        type: mongoose.Types.ObjectId,
        ref:'question',
        required:true
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref:'user',
        required:true
    },
    choice:{
        type:String,
        required:true,
    },
});

const userChoice = mongoose.model('UserChoice', userChoiceSchema);

export default userChoice;