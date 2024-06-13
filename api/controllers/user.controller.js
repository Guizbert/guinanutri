import User from "../models/user.model.js";
import Question from "../models/question.model.js";
import { errorHandler } from "../utils/error.js";
import  bcryptjs from "bcryptjs";
import UserChoice from "../models/userChoices.model.js";
import Answer from '../models/answer.model.js';

export const test = (req, res) => {
    res.json({message: 'API is working'});
};



//get all users

export const getUsers = async (req, res) => {
    const users = await User.find({}).sort({_id:1});
    if(!users || users.length ==0){
        return res.status(404).json({error: 'no users found'});
    }
    res.status(200).json(users);
}

export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(errorHandler(404, "Utilisateur introuvable"));
        }
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};


export const updateUser = async (req, res, next) => {
    //req.params.id vient de user rout alors que req.user.id est l'id de l'objet qu'on recoit
    // ça veut dire que l'utilisateur n'est pas autorisé a faire le changement
    const currentUser =  User.findById(req.params.id);
    if(req.user.id !== req.params.id){
        return next(errorHandler(403, "Non autorisé"));
    }
    if (!currentUser) {
        return next(errorHandler(404, "Utilisateur introuvable"));
    }

    console.log(req.body);
    if(req.body.password){
        if(req.body.password !== req.body.passwordConfirmation){
            return next(errorHandler(400, 'Les mots de passes reçus ne sont pas identiques'));
        }
        if(req.body.password.length < 6){
            return next(errorHandler(400, 'Le mot de passe doit contenir 6 caractères minimum.'));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
        req.body.passwordConfirmation = bcryptjs.hashSync(req.body.passwordConfirmation, 10);

    }
    if(req.body.email !== currentUser.email){
        const isMailUsed = emailAlreadyUsed(req.body.email);
        if(isMailUsed == true)
            return next(errorHandler(400, "le mail est déjà utilisé")); 
    }
    if(req.body.username){
        if(req.body.username !== currentUser.username){
            const usernameUsed = usernameAlreadyUsed(req.body.username);
            if(usernameUsed == true){
                return next(errorHandler(400, "le pseudo est déjà utilisé"));  
            }
        }
        if(req.body.username.length < 3 ||req.body.username.length > 25 ){
            return next(errorHandler(400, 'Le pseudo doit contenir entre 3 et 25 caractères.'));
        }
        if(req.body.username.includes(' ')){
            return next(errorHandler(400, "le pseudo ne peut pas contenir d'espaces")); 
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(400, "le pseudo doit contenir seulement des lettres et des chiffres")); 
        }
    }
    try{
        const userToUpdate= await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
                },
            }, { new: true }
        );
        if (!userToUpdate) {
            return next(errorHandler(404, "Utilisateur introuvable lors de la mise à jour"));
        } 
        const { password, passwordConfirmation, isActif,emailToken, isAdmin,isTherapeute, _id, ...rest} = userToUpdate._doc;
        res.status(200).json(rest);
    }catch(err){
        next(err);
    }
}


const usernameAlreadyUsed = async (usernameToCheck) => {
    const usr = await User.find({usernameToCheck});
    return usr.username == undefined ? false : true;
}

const emailAlreadyUsed = async (mailToCheck) => {
    const usr = await User.find({mailToCheck});
    return usr.email == undefined ? false : true;
};

export const deleteUser = async (req,res,next) => {
    const currentUser =  User.findById(req.params.id);
    if(req.user.id !== req.params.id){
        return next(errorHandler(403, "Non autorisé"));
    }
    if (!currentUser) {
        return next(errorHandler(404, "Utilisateur introuvable"));
    }

    try{
        await UserChoice.deleteMany({user: req.params.id});
        await Answer.deleteMany({userId: req.params.id});
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User deleted successfully');
    }catch(err){
        next(err);
    }
};


export const logout = (req, res, next) => {
    try {
      res
        .clearCookie('access_token')
        .status(200)
        .json('User has been signed out');
    } catch (error) {
      next(error);
    }
};

export const switchRole = async (req, res, next) => {
    try {
        const userId = req.body.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isAdmin) {
            await User.updateOne(
                { _id: userId },
                { $set: { isTherapeute: true, isAdmin: false } }
            );
        } else if (user.isTherapeute) {
            await User.updateOne(
                { _id: userId },
                { $set: { isTherapeute: false, isAdmin: true } }
            );
        }
        const { password, passwordConfirmation, isActif,emailToken,  ...rest} = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};


const getChoiceValue = (choice) => {
    const valueMap = {
        "moyennement": 0.5,
        "beaucoup": 1,
    };

    return valueMap[choice] || 0;
}

export const addScore = async (question,choiceStr, user) => {
    try {
        const getQ = await Question.findById(question);
        const tag = getQ.type;
        const userObjct = await User.findById(user);
        const userChoices = await UserChoice.find({ question, user });
        const choice = getChoiceValue(choiceStr);

        if (!userObjct.scores.get(tag)) { 
            userObjct.scores.set(tag, choice);
        } else {
            userObjct.scores.set(tag, userObjct.scores.get(tag) + choice);
        }
        await userObjct.save();
    } catch (e) {
        console.error(e); 
    }
}


export const substractScore = async(question,choiceStr, user) => {
    try{   
        const getQ = await Question.findById(question);
        const tag = getQ.type; 
        const userObjct = await User.findById(user);
        const choice = getChoiceValue(choiceStr);
        if (!userObjct.scores.get(tag)) {
            userObjct.scores.set(tag,choice);
        }else{
            userObjct.scores.set(tag,userObjct.scores.get(tag) - choice);
        }
        await userObjct.save();
    }catch(e){
        console.error(e);
    }
}


export const resetScore = async (userId) => {
    try {
        // Retrieve the user by ID
        const userToUpdate = await User.findById(userId);
        if (!userToUpdate) {
            throw new Error('User not found');
        }

        // Reset all scores to 0
        userToUpdate.scores.forEach((value, key) => {
            userToUpdate.scores.set(key, 0);
        });

        // Save the updated user
        await userToUpdate.save();
    } catch (error) {
        console.error(error);
    }
};

export const notifications = async (req, res, next) => {
    try {
        const user = await User.findById(req.body.userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }

        if (user.isTherapeute || (!user.isAdmin && !user.isTherapeute)) {
            const sortedNotifications = user.notifications
                .sort((a, b) => {
                    if (a.isRead === b.isRead) {
                        return new Date(b.timestamp) - new Date(a.timestamp);
                    }
                    return a.isRead - b.isRead;
                });
            res.status(200).json({ notifications: sortedNotifications });
        }
    } catch (error) {
        next(error);
    }
};



export const deleteNotification = async (req,res,next) => {
    
    try{
        const notif = req.body.formData.notification;
        const user = await User.findById(req.body.formData.userConnected._id) ;
        console.log(user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.notifications = user.notifications.filter(notification => notification._id.toString() !== notif);
        await user.save();

        res.status(200).json({ message: 'Notification deleted successfully' });
    }catch(error){
        next(error);
    }
}


export const historique = async (req, res, next) => {
    try {
        const userId = req.body.userId;

        if (!userId) {
            return res.status(404).json({ message: 'User not found' });
        }

        const history = await Answer.find({ userId: userId })
            .populate('moduleId', 'title')  
            .populate('formId', 'title')    
            .exec();

        // Extract the required fields
        const historyData = history.map(entry => ({
            id: entry._id,
            module: entry.moduleId[0].title, // Assuming there's only one module per answer
            formId: entry.formId._id,
            formTitle: entry.formId.title,
            answers: entry.answers,
        }));

        res.status(200).json({ history: historyData });
    } catch (error) {
        next(error);
    }
}


export const readNotif = async (req, res, next) => {
    try {
        const notifId = req.body.formData.notification;
        const user = await User.findById(req.body.formData.userConnected._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const notification = user.notifications.id(notifId);
        if (notification) {
            notification.isRead = true;
            await user.save();
            return res.status(200).json({ message: 'Notification marked as read successfully' });
        } else {
            return res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        next(error);
    }
};