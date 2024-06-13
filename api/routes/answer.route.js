import express from 'express';

import { createUserResponse,getByModule,
    getById, addMessageToAnswer, deleteMessage } from '../controllers/answer.controller.js';
const router = express.Router();
router.post('/allByModule',getByModule)

router.post('/newAnswer',createUserResponse)
router.post('/newMessage',addMessageToAnswer)
router.post('/:id',getById)

router.delete('/deleteMessage',deleteMessage)

//router.get('/getByModule')
export default router;