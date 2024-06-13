import Module from "../models/module.model.js";
import { errorHandler } from "../utils/error.js";
import Tag from "../models/tag.model.js";
import Video from "../models/video.model.js";
import Form from "../models/form/form.model.js";
import { getTagId } from "./tag.controller.js";
import User from "../models/user.model.js";
import Answer from "../models/answer.model.js";
import FormElement from "../models/form/formElement.model.js";

import { getByModuleId} from './form.controller.js'


// fonction a faire : 
/** 
 * - get all modules
 * - get one by Id
 * - get one by name
 * - get all by price
 * - get by creator
 * - get users
 * - create new module
 * - update module
 * - delete module
 * -
*/




//get all 
export const getModules = async (req, res) => {
    const modules = await Module.find({}).sort({moduleId:1});
    
    res.status(200).json(modules)
}

// Pour les modules publiés
export const getAllPublished = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    try {
        const modules = await Module.find({ isPublished: true })
            .skip(skip)
            .limit(limit)
            .populate('videos')
            .populate('tag')
            .exec();
        const totalModules = await Module.countDocuments({ isPublished: true });

        res.status(200).json({
            modules,
            totalModules,
            totalPages: Math.ceil(totalModules / limit),
            currentPage: page,
        });
    } catch (e) {
        next(e);
    }
}

// Pour les modules non publiés
export const getAllNotPublished = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    try {
        const modules = await Module.find({ isPublished: false })
            .skip(skip)
            .limit(limit)
            .populate('videos')
            .populate('tag')
            .exec();
        const totalModules = await Module.countDocuments({ isPublished: false });

        res.status(200).json({
            modules,
            totalModules,
            totalPages: Math.ceil(totalModules / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error('Error fetching not published modules:', error);
        res.status(500).json({ error: 'Failed to fetch not published modules' });
    }
}


//get one by id 
export const getById = async (req, res) => {
    const { id } = req.params;

    try {
        const module = await Module.findById(id)
            .populate('videos')
            .populate('tag')
            .exec();

        if (!module) {
            return res.status(404).json({ error: 'Aucun module avec cet id trouvé' });
        }

        res.status(200).json(module);
    } catch (error) {
        console.error('Error fetching module by id:', error);
        res.status(500).json({ error: 'Failed to fetch module by id' });
    }
};

// get module by title
export const getByName = async (req, res) => {
    const { title } = req.params;
    const module = await Module.findOne({ title });

    if (!module) {
        return res.status(404).json({ error: 'Aucun module avec ce titre' });
    }

    res.status(200).json(module);
}

export const nameIsAvailable = async (req, res) => {
    const { title, moduleId } = req.body; // Extract title and moduleId from request body
    try {
        const module = await Module.findOne({ title: title });

        // Check if the module exists and the moduleId does not match the one being updated
        const isAvailable = !module || (module && module._id.toString() === moduleId);

        res.json({ isAvailable });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' }); // Handle errors
    }
};



// create module (need to either change the function or create a new one for the update)

export const createModule = async (req, res, next) => {
    const { moduleId, title, description, tags, videos, creator } = req.body;

    if (creator.isAdmin || creator.isTherapeute) {
        if (!tags || !Array.isArray(tags) || tags.length === 0) {
            return res.status(400).json({ message: "Tags are required" });
        }

        const tagIds = [];
        try {
            for (const tagName of tags) {
                const tagId = await getTagId(tagName);
                tagIds.push(tagId);
            }
        } catch (error) {
            return next(error);
        }

        const createdVideos = [];
        try {
            for (const videoData of videos) {
                const { title: videoTitle, description: videoDescription, urlId } = videoData;
                const newVideo = new Video({
                    title: videoTitle,
                    description: videoDescription,
                    urlId: urlId,
                });
                const savedVideo = await newVideo.save();
                createdVideos.push(savedVideo._id);
            }
        } catch (error) {
            return next(error);
        }

        if (moduleId) {
            // Update existing module
            try {
                const updatedModule = await Module.findByIdAndUpdate(
                    moduleId,
                    {
                        title,
                        description,
                        tag: tagIds,
                        videos: createdVideos,
                        creator: creator._id,
                    },
                    { new: true }
                );

                if (!updatedModule) {
                    return res.status(404).json({ message: "Module not found" });
                }
                // Update each tag with the module ID
                await Tag.updateMany(
                    { _id: { $in: tagIds } },
                    { $push: { modules: updatedModule._id } }
                );

                // Update each video with the module ID
                await Video.updateMany(
                    { _id: { $in: createdVideos } },
                    { $set: { module: updatedModule._id } }
                );

                return res.json({ message: "Module updated", module: updatedModule });
            } catch (error) {
                return next(error);
            }
        } else {
            // Create new module
            const newModule = new Module({
                title,
                description,
                price: 0,
                tag: tagIds,
                videos: createdVideos,
                creator: creator._id,
            });

            try {
                const savedModule = await newModule.save();
                // Update each tag with the module ID
                await Tag.updateMany(
                    { _id: { $in: tagIds } },
                    { $push: { modules: savedModule._id } }
                );

                // Update each video with the module ID
                await Video.updateMany(
                    { _id: { $in: createdVideos } },
                    { $set: { module: savedModule._id } }
                );

                res.json({ message: "New module created", module: savedModule });
            } catch (error) {
                next(error);
            }
        }
    } else {
        throw new Error("Non autorisé");
    }
};



export const addFormToModule = async (req, res, next) => {
    const { moduleId, formId } = req.body;
    try {
        const moduleToUpdate = await Module.findById(moduleId);
        
        if (!moduleToUpdate || !formId) {
            return res.status(400).json({ message: "Didn't find the module or the form to add" });
        }

        await Module.updateOne(
            { _id: moduleId },
            { $set: { form: formId, isPublished: true } }
        );

        res.json({ message: "New Form added to the module", module: moduleToUpdate });
    } catch (e) {
        next(e);
    }
};

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};
export const byUserScore = async (req, res) => {
    const { userId } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        const userScores = user.scores;
        const userScoreKeys = [];
        userScores.forEach((value, key) => {
            if (value > 0) {
                userScoreKeys.push(key);
            }
        });

        if (userScoreKeys.length === 0) {
            return res.status(200).json({ modules: [], totalModules: 0, totalPages: 1, currentPage: 1 });
        }

        const modules = await Module.find({ tag: { $in: userScoreKeys }, isPublished: true })
            .skip(skip)
            .limit(limit)
            .exec();

        shuffleArray(modules);
        const totalModules = await Module.countDocuments({ tag: { $in: userScoreKeys }, isPublished: true });

        res.status(200).json({
            modules,
            totalModules,
            totalPages: Math.ceil(totalModules / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des modules" });
    }
};

export const deleteModule = async (req, res, next) => {
    const moduleId = req.body.moduleId;
    try {
        await Video.deleteMany({ module: moduleId });

        const forms = await Form.find({ module: moduleId });

        const formIds = forms.map(form => form._id);
        await FormElement.deleteMany({ form: { $in: formIds } });

        await Form.deleteMany({ module: moduleId });

        await Answer.deleteMany({ moduleId: moduleId });

        await Answer.updateMany({ moduleId: moduleId }, { $set: { messages: [] } });

        const deletedModule = await Module.findByIdAndDelete(moduleId);
        if (!deletedModule) {
            return res.status(404).json({ error: 'No module found with this id' });
        }
        res.status(200).json({ message: 'Module deleted successfully' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
