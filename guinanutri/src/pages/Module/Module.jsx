import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Select, TextInput, Textarea, RangeSlider , Alert} from 'flowbite-react';
import {useNavigate, Link } from 'react-router-dom';

export default function Module() {
    const { userConnected } = useSelector((state) => state.user);

    const [tab, setTab] = useState('');
    const [module, setModule] = useState('');
    const [moduleVideos, setModuleVideos] = useState([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [form, setForm] = useState(null);
    const [formData, setFormData] = useState({});
    const [rangeValue, setRangeValue] = useState(3); // Default value set to 3
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tabUrl = urlParams.get('id');
        if (tabUrl) {
            setTab(tabUrl);
        }
    }, []);

    useEffect(() => {
        const getModuleById = async (moduleId) => {
            try {
                const response = await fetch(`/api/module/${moduleId}`);
                if (response.ok) {
                    const moduleData = await response.json();
                    setModule(moduleData);
                    setModuleVideos(moduleData.videos);
                    if(!userConnected.isTherapeute && moduleData.isPublished == false){
                        navigate('/');
                    }
                } else {
                    throw new Error('Failed to fetch module');
                }
            } catch (error) {
                console.error(error);
            }
        };

        if (tab) {
            getModuleById(tab);
        }
    }, [tab]);

    const fetchForm = async () => {
        try {
            const formId = module.form[0];
            if (formId) {
                const response = await fetch(`/api/form/${formId}`);
                if (response.ok) {
                    const formData = await response.json();
                    setForm(formData);
                } else {
                    throw new Error('Failed to fetch form');
                }
            } else {
                throw new Error('Form ID not found in module');
            }
        } catch (error) {
            console.error('Error fetching form:', error);
        }
    };

    const handlePreviousVideo = () => {
        setCurrentVideoIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    };

    const handleNextVideo = () => {
        setCurrentVideoIndex((prevIndex) => {
            if (prevIndex < moduleVideos.length - 1) {
                return prevIndex + 1;
            } else if (prevIndex === moduleVideos.length - 1) {
                fetchForm();
                return prevIndex;
            }
            return prevIndex;
        });
    };

    const handleInputChange = (label, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [label]: value,
        }));
    };

    const handleSliderChange = (e) => {
        const value = parseInt(e.target.value);
        setRangeValue(value);
        handleInputChange('slider', value);
    };
    
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const moduleId = module._id;
        const userId = userConnected._id;
        const formattedAnswers = Object.entries(formData).map(([question, answer]) => ({ question, answer }));
        try {

           const response = await fetch(`/api/answer/newAnswer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ moduleId, userId, answers: formattedAnswers, form: form._id }),
            });
            if (!response.ok) {
                throw new Error('Failed to submit form');
            } else {
                setSuccess(true);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    
    const currentVideo = moduleVideos[currentVideoIndex];

    return (
        <div className='flex flex-col items-center min-h-screen bg-scroll'>
            {!form && currentVideo && (
                <div className="text-center mb-20 md:mb-10 md:w-1/2">
                    <div className="flex flex-col items-center mx-auto bg-black p-5">
                        <iframe
                            className="w-full md:w-full aspect-video"
                            src={`https://www.youtube.com/embed/${currentVideo.urlId}`}
                            allowFullScreen
                        ></iframe>
                    </div>
                    <h1 className="text-4xl p-2">{currentVideo.title}</h1>
                    <p className="mt-4">{currentVideo.description}</p>
                </div>
            )}

            {currentVideoIndex === moduleVideos.length - 1 && !form && (
                <div className="mt-4">
                    <Button onClick={fetchForm} className="bg-blue-600 text-white rounded">
                        Remplir formulaire
                    </Button>
                </div>
            )}

            {form && (
                <div className="flex flex-col items-center justify-center w-full p-4">
                    <h1>Formulaire de satisfaction</h1>
                    <div className="dark:bg-gray-600 bg-gray-100 shadow-md rounded-lg p-8 w-full md:w-2/3 lg:w-1/2">
                        <h2 className="text-3xl text-center mb-6">{form.title}</h2>
                        <form onSubmit={handleSubmitForm}>
                            {form.elements.sort((a, b) => a.order - b.order).map((elem) => (
                                <div key={elem._id} className="mb-4">
                                    <label className="block text-sm font-medium mb-2">{elem.label}</label>
                                    {elem.inputType === 'textarea' && (
                                        <Textarea
                                            className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            onChange={(e) => handleInputChange(elem.label, e.target.value)}
                                        />
                                    )}
                                    {elem.inputType === 'text' && (
                                        <TextInput
                                            className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            onChange={(e) => handleInputChange(elem.label, e.target.value)}
                                        />
                                    )}
                                    {elem.inputType === 'droplist' && (
                                        <Select
                                            className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            onChange={(e) => handleInputChange(elem.label, e.target.value)}
                                        >
                                            {elem.droplist.map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </Select>
                                    )}
                                    {elem.inputType === 'range' && (
                                        <div>
                                            <RangeSlider
                                                min="1"
                                                max="5"
                                                value={rangeValue}
                                                className="text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                onChange={handleSliderChange}
                                            />
                                            {(rangeValue === 1 || rangeValue === 3 || rangeValue === 5) && (
                                                <div className="text-center mt-2 text-blue-600">
                                                    {rangeValue === 1 && 'Vous avez sélectionné 1'}
                                                    {rangeValue === 3 && 'Vous avez sélectionné 3'}
                                                    {rangeValue === 5 && 'Vous avez sélectionné 5'}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {elem.inputType === 'button' && (
                                        <Button
                                            type="submit"
                                            className="p-2 bg-blue-600 text-white rounded mt-2"
                                        >
                                            {elem.label}
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </form>
                        {success && (
                            <div className="">
                                <Alert color='success'>Formulaire rempli</Alert>
                                <Link to='/'>Accueil</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!form && (
                <div className="flex justify-between mt-4">
                    <Button
                        onClick={handlePreviousVideo}
                        disabled={currentVideoIndex === 0}
                        className="bg-gray-800 text-white rounded disabled:opacity-50"
                    >
                        Vidéo précédente
                    </Button>
                    <Button
                        onClick={handleNextVideo}
                        disabled={currentVideoIndex === moduleVideos.length - 1}
                        className="bg-gray-800 text-white rounded disabled:opacity-50"
                    >
                        Vidéo suivante
                    </Button>
                </div>
            )}
        </div>
    );
}
