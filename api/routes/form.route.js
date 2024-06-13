import express from 'express';
// import Form from '../models/form/form.model';
// import FormElement from '../models/form/formElement.model';

import { getByModuleId, 
    getById, 
    newForm
 } from '../controllers/form.controller.js';

 const router = express.Router();


 //get by the module : 
 router.get("/getByModule/:moduleId", getByModuleId)

 // by id 
 router.get('/:id', getById)

 // create 

 router.post('/newForm', newForm)


 export default router;