import { addScore,substractScore,resetScore } from "./user.controller.js";
import User from "../models/user.model.js";
import userChoice from "../models/userChoices.model.js";
import { errorHandler } from "../utils/error.js";



export const getChoicesForUser = async (req, res,next) => {
    const {id} = req.body
    try {
        const user = await User.findById(id);
        if (!user) {
            return next(errorHandler(404, "Utilisateur introuvable"));
        }
        const userChoices = userChoice.find({}).sort({user:id});
        res.status(200).json(userChoices);
    } catch (err) {
        next(err);
    }
}


export const newChoiceForUser = async (req, res, next) => {
    const {question, user,tag} = req.body;
    const choice = tag;
    try {
        const Checkuser = await User.findById(user);
        if (!Checkuser) {
            return next(errorHandler(404, "Utilisateur introuvable"));
        }
        const checkChoiceExist = await userChoice.findOne({ question, user });
        if(checkChoiceExist){
            const prevChoice = checkChoiceExist.choice;
            await substractScore(question,prevChoice,user,next);
            await userChoice.updateOne(
                {question, user},
                {$set: {choice: choice}}
            );
            await addScore(question,choice, user,next); 
            res.status(200).json("scored modified successfully");
        }else{
            const newChoice = new userChoice({
                question,
                user,
                choice
            });
            const savedChoice = await newChoice.save();
            await addScore(question,choice, user,next); 
            res.status(200).json(savedChoice);
        }
    } catch (err) {
        next(err);
    }
}

export const resetScoreUser = async(req,res,next) => {
    try{
        const user = req.body;

        await userChoice.deleteMany({ user : user.userId});
        resetScore(user.userId);
        res.status(200).json(user);
    }catch(e){
        next(e);
    }
    
}