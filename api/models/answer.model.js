import mongoose from "mongoose"; 

const messageSchema = new mongoose.Schema({
    message: String,
    timestamp: {
        type: Date,
        default: Date.now
    },
    username: String,
    role: String
});

const answerSchema = new mongoose.Schema({
    moduleId: [{
        type: mongoose.Types.ObjectId,
        ref: 'Module',
    }],
    userId: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required:true,
    }],
    formId: {
        type: mongoose.Types.ObjectId,
        ref: 'Form',
    },
    answers: [{ question: String, answer: String }],
    messages: [messageSchema]
}, {timestamps: true});

const Answer = mongoose.model('Answer', answerSchema);

export default Answer;
