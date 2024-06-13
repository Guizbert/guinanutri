
import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
    title: String,
    elements:[{
        type: mongoose.Types.ObjectId,
        ref : 'FormElement',
    }],
    module: [{
        type: mongoose.Types.ObjectId,
        ref : 'Module',
    }],
  }, {timestamps: true});
  
const Form = mongoose.model('Form', formSchema);

export default Form;