import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ModuleCard from '../pages/Module/Module.card';

export default function DashModule() {
    const { theme } = useSelector((state) => state.theme);
    const [hoveredModule, setHoveredModule] = useState(null);
    const [modules, setModules] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchPublishedModules = async (page) => {
            try {
                const res = await fetch(`/api/module/modulesPublished?page=${page}&limit=3`, {
                    method: 'GET',
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch published modules');
                }
                const data = await res.json();
                setModules(data.modules);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error fetching published modules...", error);
            }
        };
        fetchPublishedModules(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div >
            <div className="flex flex-wrap justify-center">
                {modules.map((module) => (
                    <Link to={`/module?id=${module._id}`} key={module._id}>
                        <ModuleCard id={module._id} />
                    </Link>
                ))}
            </div>
            <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`mx-1 px-3 py-1 ${index + 1 === currentPage ? 'bg-blue-500 ' : 'dark:bg-gray-700 bg-slate-300'}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
