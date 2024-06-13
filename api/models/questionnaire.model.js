import mongoose from "mongoose";

const questionnaireSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
    question: [{
        type: mongoose.Types.ObjectId,
        ref: 'Question',
    }]
}, {timestamps: true}
);

const Questionnaire = mongoose.model('Questionnaire', questionnaireSchema);

export default Questionnaire;
