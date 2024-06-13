import Answer from "../models/answer.model.js";
import User from "../models/user.model.js";
import Module from "../models/module.model.js";

export const getByModule = async (req, res, next) => {
  try {
      const module = req.body.moduleId;
      const reponses = await Answer.find({ moduleId: module }).populate("userId").exec();
      if (!reponses || reponses.length === 0) {
          return res.status(404).json({ message: "Aucune réponse liée à ce module" });
      }
      res.status(200).json(reponses);
  } catch (e) {
      next(e);
  }
};



export const getById = async (req, res, next) => {
    const id = req.body.answerId;
    console.log(req.body);
    try {
        const answer = await Answer.findById(id).populate("userId").populate("moduleId").populate("formId").exec();
        if (!answer) {
            return res.status(404).json({ message: "Réponse introuvable" });
        }
        res.status(200).json(answer);
    } catch (err) {
        next(err);
    }
}

export const createUserResponse = async (req, res, next) => {
    const { moduleId, userId, answers, form } = req.body;
    console.log(req.body);
    try {
        let answerId;
        const checkUserAnswered = await Answer.findOne({ moduleId, userId });
        if (checkUserAnswered) { // update
            await Answer.updateOne(
                { moduleId, userId },
                { $set: { answers: answers, formId: form } }
            );
            answerId = checkUserAnswered._id;
            console.log("Mise à jour réussie");
        } else { // create
            const newAnswer = new Answer({
                moduleId: moduleId,
                userId: userId,
                answers: answers,
                formId: form
            });
            const saveAnswer = await newAnswer.save();
            answerId = saveAnswer._id;
            console.log("Nouvelle réponse enregistrée : ");
            console.log(saveAnswer);
        }

        // Récupérer le module associé au formulaire
        const module = await Module.findById(moduleId);

        // Récupérer tous les thérapeutes
        const therapists = await User.find({ isTherapeute: true });

        // Créer une notification pour chaque thérapeute
        const notifications = therapists.map((therapist) => {
            return {
                message: `Un utilisateur a répondu à un formulaire du module "${module.title}".`,
                recipient: therapist._id,
                user: userId,
                form: module.form,
                answerId: answerId // Ajouter l'ID de la réponse à la notification
            };
        });

        // Ajouter les notifications à chaque thérapeute
        await Promise.all(
            notifications.map(async (notification) => {
                await User.findByIdAndUpdate(notification.recipient, {
                    $push: { notifications: notification }
                });
            })
        );

        res.status(200).json({ message: "Réponse enregistrée avec succès", answerId: answerId });
    } catch (e) {
        next(e);
    }
};

export const addMessageToAnswer = async (req, res, next) => {
  try {
    const { answer, reponse, userConnected, userFromAnswer } = req.body;

    console.log("Received request body:", req.body);

    const role = userConnected.isTherapeute ? 'therapeute' : 'user';
    const updatedAnswer = await Answer.findByIdAndUpdate(
      answer,
      {
        $push: {
          messages: {
            message: reponse,
            username: userConnected.username,
            role: role,
          },
        },
        // Set isRead to false to indicate new activity
        $set: { isRead: false }
      },
      { new: true }
    );

    if (!updatedAnswer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    console.log("Updated answer:", updatedAnswer);

    if (userConnected.isTherapeute) {
     
        const notification = {
          message: `Un thérapeute a répondu à votre réponse concernant un module.`,
          recipient: userFromAnswer._id,
          user: userConnected._id,
          answerId: answer,
        };

        await User.findByIdAndUpdate(notification.recipient, {
          $push: { notifications: notification },
        });
      
    } else {
      const therapists = await User.find({ isTherapeute: true });

      await Promise.all(
        therapists.map(async (therapist) => {
          const notification = {
            message: `Un utilisateur a répondu à un formulaire du module.`,
            recipient: therapist._id,
            user: userConnected._id,
            answerId: answer,
          };

          await User.findByIdAndUpdate(notification.recipient, {
            $push: { notifications: notification },
          });
          
        })
      );
    }

    res.json(updatedAnswer);
  } catch (error) {
    console.error("Error in addMessageToAnswer:", error);
    next(error);
  }
};




export const deleteMessage = async (req,res,next) => {
  try{
    const id = req.body.messageId;
    const answer = await Answer.findOne({ "messages._id": id });
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    const messages = answer.messages;
    const updatedMessages = messages.filter(message => message._id.toString() !== id);

    if (messages.length === updatedMessages.length) {
      return res.status(404).json({ message: 'Message not found' });
    }

    answer.messages = updatedMessages;
    await answer.save();

    res.status(200).json({ message: 'Message deleted successfully' });

  }catch(e){
    next(e);
  }
} 
  

