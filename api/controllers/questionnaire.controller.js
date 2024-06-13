import Question from "../models/question.model.js";
import Questionnaire from "../models/questionnaire.model.js";
import { errorHandler } from "../utils/error.js";



export const getQuestionnaires = async (req, res) => {
    const questionnaire = await Questionnaire.find({}).sort({_id:1})
            .populate('question')
            .exec();
    if(!questionnaire || questionnaire.length ==0){
        return res.status(404).json({error: 'no questionnaire found'});
    }
    res.status(200).json(questionnaire);
}


export const addQuestionnaire = async(req,res,next) => {
    const {title, description, question} = req.body;
    if(!title  || !question || question.length ===0){
        return next(errorHandler(400, 'All fields are required'));
    }
    const newQuestionnaire = new Questionnaire({
        title,
        description,
        question
    });
    try{
        await newQuestionnaire.save();
        res.json({message: "new questionnaire added"});
    }catch(e){
        next(e);
    }

}