import express from 'express';

import { getTags, createTags } from '../controllers/tag.controller.js';

const router = express.Router();

//get all
router.get('/', getTags)


router.post('/newTag', createTags)

export default router;