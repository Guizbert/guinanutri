import express from 'express';
import User from '../models/user.model.js';
import userChoice from '../models/userChoices.model.js';
import { newChoiceForUser,getChoicesForUser, resetScoreUser } from '../controllers/userChoice.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();

router.get('/choicesForUser',verifyToken, getChoicesForUser)

router.post('/newChoiceForUser',verifyToken, newChoiceForUser)
router.post('/reset',verifyToken, resetScoreUser)


export default router;