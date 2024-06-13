import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt  from "jsonwebtoken";
import randomString from '../utils/random.js';
import verifyEmail from '../utils/sendEmail.js';
import Status from "../models/enum/status.js";
import { response } from "express";



 export const signup = async (req, res, next) => {
     try {
         const { username, email, password } = req.body;
         if (!username || !email || !password || username === '' || email === '' || password === '') {
             return next(errorHandler(400, 'All fields are required'));
         }
         const hashPassword = bcryptjs.hashSync(password, 10);
         const code = randomString(20);
         const newUser = new User({
             username,
             email,
             password: hashPassword,
             emailToken: code
         });
         await newUser.save();
         const link = `https://guinanutri-9235c252beda.herokuapp.com/verification?code=${code}`;
         await verifyEmail(email, username, link);
         const { password: psswd, __v: v, ...rest } = newUser._doc;
         res.json({ message: "Signup success", data: rest });
     } catch (error) {
         next(error);
     }
 };
 export const verify = async (req, res, next) => {
     try {
         const { token } = req.body;
         if (!token) {
             return next(errorHandler(400, 'Verification token is required'));
         }
         const user = await User.findOne({ emailToken: token });
         if (!user) {
             return next(errorHandler(400, 'Invalid verification token'));
         }
         user.emailToken = "";
         user.isActif = Status.ACTIVE;
         console.log(user.isVerified);
         await user.save();
         const { password: psswd, __v: v, ...rest } = user._doc;
         res.json({ message: "Email verified successfully.", data: rest });
     } catch (error) {
         next(error);
     }
 };
 //https://www.youtube.com/watch?v=fLYgdhixiek 11:00


//export const 
export const login = async (req, res, next) => {
    // peut faire une recherche sur le pseudo et email à voir
    const {username, password } = req.body;

    if (!username || !password || username === '' || password === '') {
        next(errorHandler(400, 'Tous les champs sont requis'));
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return next(errorHandler(404, 'Utilisateur inexistant'));
        }
        if(user.isActif === Status.INACTIF && user.username !== "admin"){
            return next(errorHandler(404, 'Compte non vérifié.'));
        }

        //compare le mdp hashé avec celui en db
        const isPasswordValid = bcryptjs.compareSync(password, user.password);
        if (!isPasswordValid) {
            // peut mettre le même message d'erreur pour éviter les problèmes
            // style pirate 
            return next(errorHandler(401, 'Mot de passe incorrect'));
        }

        // Generate and send JWT token
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin, isTherapeut: user.isTherapeute},
            process.env.JWT_KEY
        )
        //sépare ses champs de l'objet qu'on va retourné
        //
        const { password: psswd, __v:v, ...rest} = user._doc;

        // le cookie devrait se supprimer quand on quitte le navigateur
        res.status(200).cookie('access_token', token, {
            httpOnly: true,
        }).json(rest); 

    } catch (error) {
        next(error);
    }
};


export const google = async (req, res, next) => {
    // si on stock la photo il faut l'ajouter ici
    const {name, email} = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            // Generate and send JWT token
            const token = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin, isTherapeut: user.isTherapeute},
                process.env.JWT_KEY
            )

            const {password: psswd, isAdmin:admin, isTherapeute: therapeut, __v:v, ...rest} = user._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly:true,
            }).json(rest);
        }else{
            const generatePsswd = Math.random().toString(36).slice(-8) +  Math.random().toString(36).slice(-8) + '-';
            const psswdHashed = bcryptjs.hashSync(generatePsswd, 10);
            const pseudoUsed = await User.findOne({ name })
            let newPseudo ='';
            if(pseudoUsed)
                newPseudo = name.toLowerCase().split(' ').join('')+Math.random().toString(9).slice(-4);
            const newUser = new User({
                username: pseudoUsed ? newPseudo : name,
                email,
                password: psswdHashed,
                isActif: Status.ACTIVE,
                isUsingGoogle: true,
                //photo? (ne pas oublier de le mettre dans model avec photo par défaut)
            });
            await newUser.save();
            const token = jwt.sign(
                { id: newUser._id, isAdmin: newUser.isAdmin, isTherapeut: newUser.isTherapeute},
                process.env.JWT_KEY
            )
            const {_id: id, password: psswd, isAdmin:admin, isTherapeute: therapeut, __v:v, ...rest} = newUser._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly:true,
            }).json(rest);
        }
    } catch (error) {
        next(error);
    }  

}






export const signout = (req, res, next) => {
    res.clearCookie('access_token');
    res.json({ message: 'Signout success' });
}