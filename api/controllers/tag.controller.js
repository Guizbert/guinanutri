import Tag from "../models/tag.model.js";
import { errorHandler } from "../utils/error.js";


export const getTags = async (req, res) => {
    const tags = await Tag.find({}).sort({tagId:1});

    res.status(200).json(tags);
}
export const getTagById = async (id) => {
    const tag = await Tag.findById(id);

    res.status(200).json(tag);
}

export const getTagId = async (tagName) => {
    let tag = await Tag.findOne({ tag: tagName });
    if (!tag) {
        tag = new Tag({ tag: tagName });
        await tag.save();
    }
    return tag._id;
};

export const getTagByName = async (tagName) => {
    try {
        const tag = await Tag.findOne({ tag: tagName });
        return tag;
    } catch (error) {
        throw new Error(`Error fetching tag: ${tagName}`);
    }
};

export const createTags = async (req,res,next) => {
    const {tag} = req.body;

    const newTag = new Tag ({
        tag,
    });
    try {
        await newTag.save();
        res.json({message: "new tag created"});
    }catch(error){
        next(error);
    }
}