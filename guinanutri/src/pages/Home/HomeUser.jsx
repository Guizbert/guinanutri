import React, { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import About from '../About';
import ModuleCard from '../Module/Module.card';
import { Accordion } from "flowbite-react"; 
import { FaTrash } from "react-icons/fa";

export default function HomeUser() {
    const { userConnected } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    const [relatedModules, setRelatedModules] = useState([]);
    const [allModules, setAllModules] = useState([]);
    const [relatedModulesPage, setRelatedModulesPage] = useState(1);
    const [relatedModulesTotalPages, setRelatedModulesTotalPages] = useState(0);
    const [allModulesPage, setAllModulesPage] = useState(1);
    const [allModulesTotalPages, setAllModulesTotalPages] = useState(0);
    const [notifications, setNotifications] = useState([]);

    let color = theme === 'light' ? 'redToYellow' : 'purpleToBlue';

    useEffect(() => {
        console.log(userConnected); 

        const fetchRelatedModules = async (page) => {
            try {
                const res = await fetch(`/api/module/byUserScore?page=${page}&limit=3`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: userConnected._id }),
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch related modules');
                }
                const data = await res.json();
                
                setRelatedModules(data.modules);
                setRelatedModulesTotalPages(data.totalPages);
            } catch (e) {
                console.error('Error while getting the module...', e);
            }
        };

        const fetchAllModules = async (page) => {
            try {
                const res = await fetch(`/api/module/modulesPublished?page=${page}&limit=3`, {
                    method: 'GET',
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch published modules');
                }
                const data = await res.json();
                setAllModules(data.modules);
                setAllModulesTotalPages(data.totalPages);
            } catch (e) {
                console.error('Error while getting all the modules...', e);
            }
        };
        
        if (userConnected) {
            if (Object.keys(userConnected.scores).length > 0) {
                fetchRelatedModules(relatedModulesPage);
            }
            fetchAllModules(allModulesPage);
        }
    }, [userConnected, relatedModulesPage, allModulesPage]);

    const handleRelatedModulesPageChange = (page) => {
        setRelatedModulesPage(page);
    };

    const handleAllModulesPageChange = (page) => {
        setAllModulesPage(page);
    };
  
    return (
        <div className='flex flex-col items-center min-h-screen bg-scroll'>
            <div className='text-center mb-20 md:mb-10 w-3/4 md:w-1/2'>
                {userConnected ? (
                    <div>
                        <h1 className='font-sans text-4xl pb-3 pt-6'>
                            Bienvenue, <Link to='/dashboard?tab=profile' className='text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 hover:text-blue-800'>
                                {userConnected.username}
                            </Link> !
                        </h1>
                        <div className="flex justify-center items-center h-32">
                            <div className="border-t-2 rounded-lg dark:border-purple-200 border-blue-600 w-96"></div>
                        </div>
                        
                        <div className="">
                          {
                            relatedModules.length > 0 ? (
                              <div className="">
                                <h1 className='text-3xl'>Liste de Module qui pourrait vous plaire grâce aux résultat du <Link to='dashboard?tab=questionnaire' className='text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 hover:text-blue-800'>formulaire</Link></h1>
                                <div className="flex flex-wrap justify-center">
                                    {relatedModules.map((module) => (
                                      <Link to={`/module?id=${module._id}`} key={module._id}>
                                        <ModuleCard key={module._id} id={module._id} />
                                      </Link>
                                    ))}
                                </div>
                                <div className="flex justify-center mt-4">
                                    {Array.from({ length: relatedModulesTotalPages }, (_, index) => (
                                        <button
                                            key={index}
                                            className={`mx-1 px-3 py-1 ${index + 1 === relatedModulesPage ? 'bg-blue-500 ' : 'dark:bg-gray-700 bg-slate-300'}`}
                                            onClick={() => handleRelatedModulesPageChange(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                              </div>
                            ) : (
                              <h1 className='text-3xl'>
                                Pour avoir une liste de Module personnalisé, faites le 
                                <Link to='dashboard?tab=questionnaire' className='text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 hover:text-blue-800'> formulaire </Link>
                                ça ne prendra que deux minutes :-) 
                              </h1>
                            )
                          }
                        </div>
                        <div className="flex justify-center items-center h-32">
                            <div className="border-t-2 rounded-lg dark:border-purple-200 border-blue-600 w-96"></div>
                        </div>
                        <div className="">
                            <h1>Voici d'autres modules :</h1>
                            <div className="flex flex-wrap justify-center">
                                {allModules.map((module) => (
                                  <Link to={`/module?id=${module._id}`} key={module._id}>
                                    <ModuleCard key={module._id} id={module._id} />
                                   </Link>
                                ))}
                            </div>
                            <div className="flex justify-center mt-4">
                                {Array.from({ length: allModulesTotalPages }, (_, index) => (
                                    <button
                                        key={index}
                                        className={`mx-1 px-3 py-1 ${index + 1 === allModulesPage ? 'bg-blue-500 ' : 'dark:bg-gray-700 bg-slate-300'}`}
                                        onClick={() => handleAllModulesPageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h1 className='underline font-sans text-4xl pb-3 pt-6'>
                            Préparez-vous à améliorer votre bien-être !
                        </h1>
                        <p className='font-sans text-lg pb-3'>
                            Faites notre test pour avoir une recommandation personnalisée de compléments adaptée à vos besoins.
                        </p>
                        <Link to='/signup'>
                            <Button gradientDuoTone={color} className='mx-auto'>
                                Faire le test
                            </Button>
                        </Link>
                        <div className="flex justify-center items-center h-32">
                            <div className="border-t-2 rounded-lg dark:border-purple-200 border-blue-600 w-96"></div>
                        </div>
                        <About />
                    </div>
                )}
            </div>
        </div>
    );
}
