import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ModuleCard({ id }) {
    const [module, setModule] = useState(null);
    const [hoveredModule, setHoveredModule] = useState(null);

    useEffect(() => {
        const fetchModuleById = async () => {
            try {
                const response = await fetch(`/api/module/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch module');
                }
                const moduleData = await response.json();
                setModule(moduleData);
            } catch (error) {
                console.error('Error fetching module:', error);
            }
        };

        fetchModuleById();
    }, [id]);

    if (!module) {
        return <div>Loading...</div>;
    }

    const getYouTubeVideoID = (urlId) => {
        return urlId;
    };

    const getThumbnailUrl = (urlId) => {
        const videoID = getYouTubeVideoID(urlId);
        return `http://img.youtube.com/vi/${videoID}/0.jpg`;
    };

    const firstVideoThumbnailUrl = module.videos.length > 0 ? getThumbnailUrl(module.videos[0].urlId) : '';

    return (
            <div
                className={`p-5 md:p-10 relative overflow-hidden transition-transform duration-300 ${
                    hoveredModule === module._id ? 'transform scale-110 shadow-lg rounded-lg z-50' : ''
                }`}
                onMouseEnter={() => setHoveredModule(module._id)}
                onMouseLeave={() => setHoveredModule(null)}
                style={{ margin: '1rem' }}
            >
                <div className="flex flex-col md:flex-row">
                    <div className="module-image mr-4">
                        {firstVideoThumbnailUrl && (
                            <img
                                alt={module.videos[0].title}
                                src={firstVideoThumbnailUrl}
                                className="h-48 md:h-56 w-full object-contain rounded-lg"
                            />
                        )}
                    </div>
                    <div className="module-content pt-20 max-w-52 flex-grow dark:bg-gray-900">
                        <h3 className="text-lg font-semibold">{module.title}</h3>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-3 text-wrap">{module.description}</p>
                    </div>
                </div>
            </div>
    );
}
