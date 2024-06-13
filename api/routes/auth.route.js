import express from 'express';
import { signup, verify } from '../controllers/auth.controller.js';
import { login } from '../controllers/auth.controller.js';
import { google } from '../controllers/auth.controller.js';

const router = express.Router();


router.post('/signup', signup);
router.post('/verify', verify);
router.post('/login', login);

router.post('/google', google);
export default router;