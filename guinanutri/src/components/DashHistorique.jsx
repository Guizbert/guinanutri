import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AnswerCard from '../pages/Module/AnswerCard';

export default function DashHistorique() {
    const { userConnected } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch('/api/user/historique', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: userConnected._id }),
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch history');
                }

                const data = await res.json();
                setHistory(data.history);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching history:', error);
                setIsLoading(false);
            }
        };

        if (userConnected) {
            fetchHistory();
        }
    }, [userConnected]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Historique des Réponses</h1>
            {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {history.map((entry, index) => (
                        <div key={index} className="border border-gray-300 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                            <Link to={`/reponse?answer=${entry.id}`}>
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-2">{entry.module}</h2>
                                    <p className="text-gray-600 mb-2">{entry.formTitle}</p>
                                    <ul className="divide-y divide-gray-200">
                                        {Array.isArray(entry.answers) && entry.answers.map((answer, idx) => (
                                            <li key={idx} className="py-2">
                                                <AnswerCard user={userConnected} answers={[answer]} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
