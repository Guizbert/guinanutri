import express from 'express';
import {getQuestions, addQuestion } from '../controllers/question.controller.js';
import User from '../models/user.model.js';
import { verifyToken, checkAdminOrTherapist } from '../utils/verifyUser.js';


const router = express.Router();


router.get('/questions',getQuestions);
router.post('/testNewQuestion', addQuestion);
//router.get('/newQuestion', verifyToken, checkAdminOrTherapist, addQuestion);


export default router;