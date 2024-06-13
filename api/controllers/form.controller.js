import { errorHandler } from "../utils/error.js";
import Form from "../models/form/form.model.js";
import FormElement from "../models/form/formElement.model.js";
import Module from "../models/module.model.js";
import User from "../models/user.model.js";

export const getByModuleId = async (id) => {
    try{
        const module = await Module.findById({id})
        .populate('form')
        .exec();

        res.status(200).json(module.form);
        
    }catch (error) {
        console.log(error); // Handle errors
    }
}

export const getById = async (req, res, next) => {
    const {id} = req.params;
    try{
        const form = await Form.findById(id)
            .populate('elements')
            .exec();
        if(!form){
            return res.status(404).json({ error: 'Aucun form avec cet id trouvé' });
        }
        res.status(200).json(form);
    }catch(error){
        next(error);
    }
}


export const newForm = async (req, res, next) => {
    const { title, formElem, module, user } = req.body;

    if (user.isAdmin || user.isTherapeute) {
        if (!formElem || !Array.isArray(formElem) || formElem.length === 0) {
            return res.status(400).json({ message: "Form elements are required" });
        }

        if (!module) {
            return res.status(400).json({ message: "Module ID is required" });
        }

        try {

            const moduleToUpdate = await Module.findById(module);

            if (!moduleToUpdate) {
                return res.status(400).json({ message: "Module not found" });
            }

            // Find the current form associated with the module
            let existingForm = await Form.findOne({ module: module }).sort({ createdAt: -1 });

            // Create new form elements
            const formElemId = [];
            for (let index = 0; index < formElem.length; index++) {
                const element = formElem[index];
                const { inputType, label, droplist } = element;
                const newElem = new FormElement({
                    order: index + 1, // Set order based on index + 1
                    inputType: inputType,
                    label: label,
                    droplist: droplist,
                });
                const savedElem = await newElem.save();
                formElemId.push(savedElem._id);
            }

            if (existingForm) {
                // If form already exists, delete its elements and update it
                await FormElement.deleteMany({ form: existingForm._id });
                await Form.findByIdAndUpdate(existingForm._id, {
                    title: title,
                    elements: formElemId,
                });
            } else {
                // If form doesn't exist, create a new one
                existingForm = new Form({
                    title: title,
                    elements: formElemId,
                    module: module,
                });
                await existingForm.save();
            }

            // Update the form elements with the new form
            await FormElement.updateMany(
                { _id: { $in: formElemId } },
                { $set: { form: existingForm._id } }
            );
            res.json({ message: "Form updated", form: existingForm });
        } catch (e) {
            next(e);
        }
    } else {
        return res.status(403).json({ message: "Unauthorized" });
    }
};


// export const newFormWithoutModule = async (req, res, next) => {
//     const { title, formElem, user } = req.body;

//     if (user.isAdmin || user.isTherapeute) {
//         if (!formElem || !Array.isArray(formElem) || formElem.length === 0) {
//             return res.status(400).json({ message: "Form elements are required" });
//         }
//         try {
//             if (!moduleToUpdate) {
//                 return res.status(400).json({ message: "Module not found" });
//             }

//             // Find the current form associated with the module
//             let existingForm = await Form.findOne({ module: module }).sort({ createdAt: -1 });

//             // Create new form elements
//             const formElemId = [];
//             for (let index = 0; index < formElem.length; index++) {
//                 const element = formElem[index];
//                 const { inputType, label, droplist } = element;
//                 const newElem = new FormElement({
//                     order: index + 1, // Set order based on index + 1
//                     inputType: inputType,
//                     label: label,
//                     droplist: droplist,
//                 });
//                 const savedElem = await newElem.save();
//                 formElemId.push(savedElem._id);
//             }

//             if (existingForm) {
//                 // If form already exists, delete its elements and update it
//                 await FormElement.deleteMany({ form: existingForm._id });
//                 await Form.findByIdAndUpdate(existingForm._id, {
//                     title: title,
//                     elements: formElemId,
//                 });
//             } else {
//                 // If form doesn't exist, create a new one
//                 existingForm = new Form({
//                     title: title,
//                     elements: formElemId,
//                     module: module,
//                 });
//                 await existingForm.save();
//             }

//             // Update the form elements with the new form
//             await FormElement.updateMany(
//                 { _id: { $in: formElemId } },
//                 { $set: { form: existingForm._id } }
//             );
//             res.json({ message: "Form updated", form: existingForm });
//         } catch (e) {
//             next(e);
//         }
//     } else {
//         return res.status(403).json({ message: "Unauthorized" });
//     }
// };
