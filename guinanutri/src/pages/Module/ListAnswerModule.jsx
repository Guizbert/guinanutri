import React, { useEffect, useState } from 'react';
import { Button, TextInput, Alert, Select, Modal, ModalBody } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import AnswerCard from './AnswerCard';

export default function ListAnswerModule() {
    const [tab, setTab] = useState('');
    const [reponses, setReponses] = useState([]);
    const [module, setModule] = useState([]);
    const navigate = useNavigate();
    const { userConnected } = useSelector((state) => state.user);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tabUrl = urlParams.get('id');

        if (!tabUrl) {
            navigate('/');
            return;
        }

        setTab(tabUrl);

        if (!userConnected.isTherapeute) {
            navigate('/');
            return;
        }

        const getReponses = async () => {
            try {
                const responses = await fetch('/api/answer/allByModule', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ moduleId: tabUrl }),
                });

                if (!responses.ok) {
                    console.log('Failed to fetch the answer');
                }

                const res = await responses.json();
                setReponses(res);
            } catch (error) {
                console.error('Error fetching responses:', error);
            }
        };
        const getModule = async () => {
            try {
                const res = await fetch(`/api/module/${tabUrl}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch module');
                }
                const moduleData = await res.json();
                setModule(moduleData);
            } catch (err) {
                console.error('Error while fetching the module: ', err);
            }
        }

        getModule();
        getReponses();
    }, [navigate, userConnected, tab]);

    return (
        <div className="container mx-auto mt-5">
            <h1 className="text-3xl font-bold mb-5">Réponses au Module : {module.title}</h1>
            {reponses.length > 0 ? (
                reponses.map((response, index) => (
                    <Link to={`/reponse?answer=${response._id}`}>
                        <AnswerCard 
                            key={index}
                            user={response.userId[0]}
                            answers={response.answers}
                        />
                    </Link>
                ))
            ) : (
                <p className="text-center text-2xl">Aucune réponse trouvée pour ce module.</p>
            )}
        </div>
    );
}
