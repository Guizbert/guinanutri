import React, { useEffect, useState } from 'react';
import { Button, TextInput, Alert, Select,Modal, ModalBody } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function CreationModule() {
    const { userConnected } = useSelector((state) => state.user);
    const [title, setTitle] = useState("");
    const [titleVideo, setTitleVideo] = useState("");
    const [url, setUrl] = useState("");
    const [descriptionModule, setDescModule] = useState("");
    const [descriptionVideo, setDescVideo] = useState("");
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState(""); 
    const [selectedTags, setSelectedTags] = useState([]); 
    const [videos, setVideos] = useState([]);

    const navigate = useNavigate();

    const [tab, setTab] = useState('');
    const [errorMessageModule, setErrorMessageModule] = useState("");
    const [errorMessageVideo, setErrorMessageVideo] = useState("");
    const [canSave, setCanSave] = useState(false);
    const [errorModule, setErrorModule] = useState(false);
    const [errorVideo, setErrorVideo] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const [showDial, setShowDial] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tabUrl = urlParams.get('id');
        if (tabUrl) {
            setTab(tabUrl);
            const getModule = async () => {
                try {
                    const res = await fetch(`/api/module/${tabUrl}`);
                    if (!res.ok) {
                        throw new Error('Failed to fetch module');
                    }
                    const moduleData = await res.json();
                    setTitle(moduleData.title);
                    setDescModule(moduleData.description);
                    setSelectedTags(moduleData.tag.map(t => t.tag)); // Correctly setting the tags
                    setVideos(moduleData.videos);
                    setCanDelete(true);
                    setCanSave(true);
                } catch (err) {
                    console.error('Error while fetching the module: ', err);
                    navigate('/');
                }
            }

            getModule();
        }
    }, []);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch('/api/tag/', {
                    method: 'GET',
                });
                const tags = await response.json();
                setTags(tags);
            } catch (error) {
                console.error('There was an error fetching the module tags!', error);
            }
        };
        fetchTags();
    }, []);

    const validateModuleTitle = async (title) => {
        if (title.length < 3 || title.length > 50) {
            return false;
        }
        const formData = {
            title: title,
            moduleId: tab
        };

        try {
            const res = await fetch(`/api/module/isAvailable`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                throw new Error('Failed to check if name is available');
            }
            const { isAvailable } = await res.json();
            return isAvailable;
        } catch (error) {
            console.error('There was an error trying to verify the title!', error);
            return false;
        }
    };

    const validateModule = async (newTitle, newDescription) => {
        // Trim and remove extra spaces 
        
        const cleanedTitle = newTitle.trim().replace(/\s+/g, ' ');
        const cleanedDescription = newDescription.trim().replace(/\s+/g, ' ');
        const isTitleValid = cleanedTitle.length >= 3 && cleanedTitle.length <= 50;
        const isDescriptionValid = cleanedDescription.length >= 3 && cleanedDescription.length <= 50;
        const nameIsAvailable = await validateModuleTitle(cleanedTitle);
    
        if (!isTitleValid || !isDescriptionValid || !nameIsAvailable) {
            setErrorMessageModule("Le titre (unique) et la description doivent contenir entre 3 et 50 caractères");
            setErrorModule(true);
        } else {
            setErrorMessageModule("");
            setErrorModule(false);
        }
    
        return isTitleValid && isDescriptionValid && nameIsAvailable;
    };

    const newTitle = (e) => {
        const titre = e.target.value;
        setTitle(titre);
        checkCanSaveModule(titre, descriptionModule, selectedTags, videos);
    };

    const handleTitleBlur = async () => {
        await validateModule(title, descriptionModule);
    };

    const newDescriptionModule = (e) => {
        const desc = e.target.value;
        setDescModule(desc);
        validateModule(title, desc);
        checkCanSaveModule(title, desc, selectedTags, videos);
    };

    const validateVideoInfo = () => {
        const isTitleValid = titleVideo.length >= 3 && titleVideo.length <= 50;
        const isDescriptionValid = descriptionVideo.length >= 3 && descriptionVideo.length <= 50;

        if (!isTitleValid || !isDescriptionValid) {
            setErrorMessageVideo("Le titre et la description doivent contenir entre 3 et 50 caractères");
            setErrorVideo(true);
        } else {
            setErrorMessageVideo("");
            setErrorVideo(false);
        }

        return isTitleValid && isDescriptionValid;
    };

    const getYouTubeUrlId = (url) => {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const resetField = () => {
        setTitleVideo("");
        setDescVideo("");
        setUrl("");
    };

    const newUrl = (e) => {
        setUrl(e.target.value);
    };

    const newTitreVideo = (e) => {
        setTitleVideo(e.target.value);
        validateVideoInfo();
    };

    const newDescriptionVideo = (e) => {
        setDescVideo(e.target.value);
        validateVideoInfo();
    };

    const newVideo = () => {
        const urlId = getYouTubeUrlId(url);
        if (validateVideoInfo() && urlId && !videos.some(video => video.urlId === urlId)) {
            const updatedVideos = [...videos, { title: titleVideo, urlId, description: descriptionVideo }];
            setVideos(updatedVideos);
            setErrorMessageVideo("");
            setErrorVideo(false);
            resetField();
            checkCanSaveModule(title, descriptionModule, selectedTags, updatedVideos);
        } else {
            setErrorMessageVideo("Il faut au moins une vidéo (et elle doit être unique). Le titre et la description doivent contenir entre 3 et 50 caractères");
            setErrorVideo(true);
        }
    };

    const removeVideo = (videoToRemove) => {
        const updatedVideos = videos.filter(video => video !== videoToRemove);
        setVideos(updatedVideos);
        checkCanSaveModule(title, descriptionModule, selectedTags, updatedVideos);
    };

    const addTag = () => {
        if (selectedTag && !selectedTags.includes(selectedTag)) {
            const updatedTags = [...selectedTags, selectedTag];
            setSelectedTags(updatedTags);
            setSelectedTag("");
            checkCanSaveModule(title, descriptionModule, updatedTags, videos);
        }
    };

    const removeTag = (tagToRemove) => {
        const updatedTags = selectedTags.filter(tag => tag !== tagToRemove);
        setSelectedTags(updatedTags);
        checkCanSaveModule(title, descriptionModule, updatedTags, videos);
    };

    const checkCanSaveModule = async (title, description, tags, videos) => {
        const isModuleValid = await validateModule(title, description);
        const hasTags = tags.length > 0;
        const hasVideos = videos.length > 0;
        setCanSave(isModuleValid && hasTags && hasVideos);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (canSave) {
            const moduleData = {
                moduleId:tab,
                title,
                description: descriptionModule,
                tags: selectedTags,
                videos: videos.map(video => ({
                    title: video.title,
                    description: video.description,
                    urlId: video.urlId,
                })),
                creator: userConnected,
            };
            try {
                const res = await fetch('/api/module/modifModule', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(moduleData),
                });
                if (!res.ok) {
                    throw new Error('Failed to save the module');
                }
                const responseData = await res.json();
                navigate(`/questionnaire?module=${responseData.module._id}`);
            } catch (error) {
                setErrorMessageModule('Failed to save the module. Please try again.');
                setErrorModule(true);
            }
        } else {
            setErrorMessageModule("Please complete the module title and description, add at least one tag, and one video.");
            setErrorModule(true);
        }
    };

    const handleDelete = async () => {
        setShowDial(false);
        try {
            const res = await fetch(`/api/module/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({moduleId: tab}),
            });
            const data = await res.json();
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    }
    if (userConnected.isAdmin || userConnected.isTherapeute) {
        return (
            <div className="grid grid-cols-1 md:p-5">
                <div>
                    <h1 className="text-2xl font-bold mb-5">Création module ({title})</h1>
                    {tab && (
                        <div className=" mb-4">
                            <Link className='2xl border rounded-lg dark:bg-gray-600 bg-slate-300 p-2 hover:bg-slate-400 dark:hover:bg-gray-800' to={`/module?id=${tab}`}>Voir le module : (il faut le créer d'abord)</Link>
                            {userConnected.isTherapeute && (
                                <Link className='2xl border rounded-lg dark:bg-gray-600 bg-slate-300 p-2 ml-2 hover:bg-slate-400 dark:hover:bg-gray-800' to={`/reponseModule?id=${tab}`}>Voir les réponses :</Link>

                            )}
                        </div>       
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <TextInput
                                placeholder='Titre du module'
                                onChange={newTitle}
                                onBlur={handleTitleBlur}
                                value={title}
                            />
                            <TextInput
                                placeholder='Description du module'
                                onChange={newDescriptionModule}
                                value={descriptionModule}
                            />
                            {errorModule && (
                                <Alert className='w-64' color='failure'>
                                    {errorMessageModule}
                                </Alert>
                            )}
                            <h1 className="text-xl font-semibold mt-5">Ajout vidéo :</h1>
                            <TextInput
                                placeholder='URL exemple : https://www.youtube.com/watch?v=52wO9FCMRMo'
                                onChange={newUrl}
                                value={url}
                            />
                            <TextInput
                                placeholder='Titre'
                                onChange={newTitreVideo}
                                value={titleVideo}
                            />
                            <TextInput
                                placeholder='Description'
                                onChange={newDescriptionVideo}
                                value={descriptionVideo}
                            />
                            <Button onClick={newVideo} className="mt-2">Ajout d'une vidéo </Button>
                            {errorVideo && (
                                <Alert className='w-64' color='failure'>
                                    {errorMessageVideo}
                                </Alert>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                                {videos.map((video, index) => (
                                    <div
                                        key={index}
                                        className="p-4 md:p-6 relative overflow-hidden transition-transform duration-300 transform hover:scale-105 shadow-lg rounded-lg z-50"
                                    >
                                        <div className="flex flex-col md:flex-row">
                                            <div className="module-image mr-4">
                                                <img
                                                    alt=""
                                                    src={`http://img.youtube.com/vi/${video.urlId}/0.jpg`}
                                                    className="h-48 md:h-56 w-full object-contain rounded-lg"
                                                />
                                            </div>
                                            <div className="module-content flex-grow">
                                                <h3 className="text-lg font-semibold">{video.title}</h3>
                                                <p className="mt-2 text-sm text-gray-600 line-clamp-3 text-wrap">{video.description}</p>
                                            </div>
                                            <FaTrash onClick={() => removeVideo(video)} className='ml-2 cursor-pointer text-2xl hover:text-red-800 text-red-600' />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 space-y-2">
                                {selectedTags.map((tag, index) => (
                                    <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                        {tag}
                                        <FaTrash onClick={() => removeTag(tag)} className="ml-2 cursor-pointer text-red-600 hover:text-red-800" />
                                    </span>
                                ))}
                            </div>
                            <div className="mt-4">
                                <h2 className="text-lg font-semibold">Ajouter des tags :</h2>
                                <Select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} className="mt-2">
                                    <option value="">Sélectionner un tag</option>
                                    {tags.map((tag, index) => (
                                        <option key={index} value={tag.tag}>
                                            {tag.tag}
                                        </option>
                                    ))}
                                </Select>
                                <Button onClick={addTag} disabled={!selectedTag} className="mt-2">Ajouter ce tag</Button>
                            </div>
                        </div>
                        <div className="mt-6 flex space-x-4">
                            <Button type='submit' color='success' disabled={!canSave}>Sauvegarder le module et passer à l'étape suivante</Button>
                            {canDelete && (
                                <Button color='failure' className="flex items-center space-x-2" onClick={() => setShowDial(true)}>
                                    <span>Supprimer ce module</span> <FaTrash  className=' text-xl w-10'/>
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
                <Modal show={showDial} 
                    onClose={() => setShowDial(false)} 
                    popup size='md'>
                    <Modal.Header>
                        <Modal.Body>
                            <div className="text-center">
                                <HiOutlineExclamationCircle 
                                    className='h-14 w-14 text-red-400 dark:text-gray-200 mb-4 mx-auto'/>
                                <h3 className='mb-5 text-lg text-red-800 dark:text-blue-100'>
                                    Voulez-vous vraiment supprimer ce module ? 
                                    Cette action est irréversible :)
                                </h3>
                                <div className='flex justify-center gap-4'>
                                    <Button color='failure' onClick={handleDelete}>
                                        Oui
                                    </Button>
                                    <Button color='gray' onClick={() => setShowDial(false)}>
                                        Non
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal.Header>
                </Modal>
            </div>
        );
    } else {
        navigate('/error');
    }
}
