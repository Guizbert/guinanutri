import mongoose, {mongo} from "mongoose";

const tagSchema = new mongoose.Schema({
    
    tag: {
        type: String,
        required: true,
        min: 2,
        unique: true,
    },

    module:[{
        type: mongoose.Types.ObjectId,
        ref: 'Module',
    }],

    question:[{
        type: mongoose.Types.ObjectId,
        ref: 'Question',
    }]

})


const Tag = mongoose.model('Tag', tagSchema);

export default Tag;