import express from 'express';
import { deleteUser, test } from '../controllers/user.controller.js';
import { getUsers, updateUser, logout, substractScore,addScore, switchRole, notifications, deleteNotification, historique, readNotif} from '../controllers/user.controller.js';
import User from '../models/user.model.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.get('/users', getUsers);
router.post('/logout', logout);
router.post('/addScore',addScore);
router.post('/substractScore',substractScore );
router.post('/changeRole',switchRole );
router.post('/notifications', verifyToken, notifications);
router.post('/readNotif', readNotif);

router.put('/update/:id', verifyToken, updateUser );
router.delete('/delete/:id', verifyToken, deleteUser);


router.delete('/deleteNotification', deleteNotification);

router.post('/historique',historique);

export default router;