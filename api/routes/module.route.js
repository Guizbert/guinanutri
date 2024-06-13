import express from 'express';
import Module from '../models/module.model.js';
import {
    getModules,
    getById,
    createModule,
    getByName,
    nameIsAvailable,
    getAllNotPublished,
    addFormToModule,
    getAllPublished,
    byUserScore,
    deleteModule
} from '../controllers/module.controller.js';

const router = express.Router();


//get all
router.get('/', getModules)

//get all not published
router.get('/modulesNotPublished', getAllNotPublished)

//get all published
router.get('/modulesPublished', getAllPublished)


//get one (by id)
router.get('/:id',getById )


//get one (by name)
router.get('/:name',getByName)


// Name available
router.post('/isAvailable/', nameIsAvailable)


// by user score
router.post('/byUserScore', byUserScore)

//get one (by creator)


// get users



//create
router.post('/modifModule', createModule)

//add Form 
router.post('/addFormToModule',addFormToModule)



//delete
router.delete('/delete',deleteModule);

export default router;