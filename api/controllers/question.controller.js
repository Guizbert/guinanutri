import Question from "../models/question.model.js";
import QuestionType from "../models/enum/question.enum.js";
import { errorHandler } from "../utils/error.js";
import { getTagByName } from "./tag.controller.js";
import Tag from "../models/tag.model.js";


export const getQuestions = async (req, res) => {
    const questions = await Question.find({}).sort({_id:1});
    if(!questions || questions.length ==0){
        return res.status(404).json({error: 'no questions found'});
    }
    res.status(200).json(questions);
}

export const addQuestion = async (req, res, next) => {
    const {body, type}= req.body;
    if(!body || !type)
    {
        return next(errorHandler(400, 'All fields are required'));
    }
    const typeId = await getTagByName(type);
    const newQuestion = new Question( {
        body,
        type:typeId
    });
    try{
        await newQuestion.save();
        res.json({message: "new question added"});
    }catch(e){
        next(e);
    }
};

export const deleteQuestion = async (req, res, next) => {
    const currentQuestion = Question.findById(req.params.id);

    if(req.question.id !== req.params.id){
        return next(errorHandler(403, 'Non autorisé'));
    }
    if(!currentQuestion){
        return next(errorHandler(404, 'Question introuvable'));
    }
    if(bodyAlreadyUsed){
        return next(errorHandler(400, 'Body already used'));
    }
    try{
        const questionToUpdate = await Question.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    body: req.body.body,
                    information: req.body.information,
                    type: req.body.type
                },
            }, {new : true}
        );
    }catch(e){
        next(e);
    }
};

const bodyAlreadyUsed = async (body) => {
    const question = await Question.find({body});
    return question.body == undefined ? false : true;
};