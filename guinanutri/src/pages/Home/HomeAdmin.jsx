import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ModuleCard from '../Module/Module.card';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Accordion, Button } from "flowbite-react"; 
import { FaTrash } from "react-icons/fa";
export default function HomeAdmin() {
    const { userConnected } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    const [notPublishedModules, setNotPublishedModules] = useState([]);
    const [publishedModules, setPublishedModules] = useState([]);
    const [notPublishedPage, setNotPublishedPage] = useState(1);
    const [notPublishedTotalPages, setNotPublishedTotalPages] = useState(0);
    const [publishedPage, setPublishedPage] = useState(1);
    const [publishedTotalPages, setPublishedTotalPages] = useState(0);
    const [actualRole, setRole] = useState("");
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    let color = theme === 'light' ? 'redToYellow' : 'purpleToBlue';

    useEffect(() => {
        const fetchNotPublishedModules = async (page) => {
            try {
                const res = await fetch(`/api/module/modulesNotPublished?page=${page}&limit=3`, {
                    method: 'GET',
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch not published modules');
                }
                const data = await res.json();
                setNotPublishedModules(data.modules);
                setNotPublishedTotalPages(data.totalPages);
            } catch (error) {
                console.error('Error fetching not published modules:', error);
            }
        };

        const fetchPublishedModules = async (page) => {
            try {
                const res = await fetch(`/api/module/modulesPublished?page=${page}&limit=3`, {
                    method: 'GET',
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch published modules');
                }
                const data = await res.json();
                setPublishedModules(data.modules);
                setPublishedTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error fetching published modules:", error);
            }
        };
      

        if (userConnected && (userConnected.isAdmin || userConnected.isTherapeute)) {
            fetchNotPublishedModules(notPublishedPage);
            fetchPublishedModules(publishedPage);
        }
        if(userConnected.isAdmin){
            setRole("Admin");
        }
        if (userConnected.isTherapeute){
            setRole("Thérapeute");
        }
    }, [userConnected, notPublishedPage, publishedPage]);

    const handleNotPublishedPageChange = (page) => {
        setNotPublishedPage(page);
    };

    const handlePublishedPageChange = (page) => {
        setPublishedPage(page);
    };



    if (userConnected && (userConnected.isAdmin || userConnected.isTherapeute)) {
        return (
            <div className="flex flex-col items-center min-h-screen bg-scroll">
                <div className="text-left mb-20 md:mb-10 w-3/4 md:w-1/2 text-4xl p-5">
                    <p>Bienvenue, <span className='text-blue-700 dark:text-blue-400 dark:hover:text-blue-500  hover:text-blue-800' >{ userConnected.username}</span> !</p>
                    <br />
                    <h1>Liste de modules qui n'ont pas de formulaire et donc non publiés :</h1>
                    {notPublishedModules.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {notPublishedModules.map((module) => (
                                <Link to={`/creationModule?id=${module._id}`} key={module._id} >
                                    <ModuleCard key={module._id} id={module._id} />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p>Aucun module non publié trouvé.</p>
                    )}
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: notPublishedTotalPages }, (_, index) => (
                            <button
                                key={index}
                                className={`mx-1 px-3 py-1 ${index + 1 === notPublishedPage ? 'bg-blue-500 ' : 'dark:bg-gray-700 bg-slate-300'}`}
                                onClick={() => handleNotPublishedPageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    <br />
                    <h1>Liste des modules publiés :</h1>
                    {publishedModules.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                            {publishedModules.map((module) => (
                                <Link to={`/creationModule?id=${module._id}`} key={module._id} >
                                    <ModuleCard key={module._id} id={module._id}/>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p>Aucun module publié trouvé.</p>
                    )}
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: publishedTotalPages }, (_, index) => (
                            <button
                                key={index}
                                className={`mx-1 px-3 py-1 ${index + 1 === publishedPage ? 'bg-blue-500 ' : 'dark:bg-gray-700 bg-slate-300'}`}
                                onClick={() => handlePublishedPageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
                <Link to='/creationModule' className=''>
                    <Button gradientDuoTone={color} className='mx-auto font-sans text-lg font-bold'>
                        Nouveau module
                    </Button>
                </Link>
            </div>
        );
    } else {
        navigate('/error');
    }
}
