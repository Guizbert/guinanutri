
import mongoose from "mongoose";

const formElementSchema = new mongoose.Schema({
    order: {
        type: Number,
        required: true,
    },
    inputType:{ 
        type: String,
        required: true,
    },
    label:{ 
        type: String,
        required: true,
    },
    droplist:[{ 
        type: String,
    }],
    form:{
        type: mongoose.Types.ObjectId,
        ref: 'Form',
    }

}, {timestamps: true});
  
const FormElement = mongoose.model('FormElement', formElementSchema);

export default FormElement;