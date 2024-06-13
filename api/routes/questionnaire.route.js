import express from 'express';

import { getQuestionnaires, addQuestionnaire } from '../controllers/questionnaire.controller.js';

const router = express.Router();

//get all
router.get('/',getQuestionnaires )


router.post('/newQuestionnaire', addQuestionnaire)

export default router;