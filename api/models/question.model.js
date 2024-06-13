import mongoose from "mongoose";
import QuestionType from "./enum/question.enum.js";

const questionSchema = new mongoose.Schema ({
        body:{
            type: String,
            required: true,
            min: 3,
            max: 50
        },
        type:{
            type: mongoose.Types.ObjectId,
            ref:'tag',
            required:true
        },
    }, {timestamps: true}
);

const Question = mongoose.model('Question', questionSchema);

export default Question;