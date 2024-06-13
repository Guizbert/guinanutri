import React, { useEffect, useState } from 'react';
import { Button, Textarea } from 'flowbite-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaTrash } from "react-icons/fa";

export default function Answer() {
    const { userConnected } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const location = useLocation();
    const [answer, setAnswer] = useState(null);
    const [response, setResponse] = useState("");
    const [module, setModule] = useState({});
    const [reponses, setReponses] = useState([]);
    const [user, setUser] = useState({});
    const [messages, setMessages] = useState([]);
    const [textarea, setTextarea] = useState("");
    const [disableBtn, setDisableBtn] = useState(true);

    useEffect(() => {
      if(!userConnected){
        navigate('/login');
      }
        const fetchAnswerData = async (answerId) => {
            try {
                const response = await fetch(`/api/answer/${answerId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ answerId }),
                });
                if (response.ok) {
                    const answerData = await response.json();
                    setAnswer(answerData);
                    setModule(answerData.moduleId[0]);
                    setReponses(answerData.answers);
                    setUser(answerData.userId[0]);
                    setMessages(answerData.messages);
                    const isAuthorized = userConnected.username === answerData.userId[0].username || userConnected.isTherapeute;
                    if (!isAuthorized) {
                        navigate('/');
                    }
                } else {
                    navigate('/');
                    throw new Error('Failed to fetch answer');
                }
            } catch (error) {
                console.error(error);
            }
        };

        const urlParams = new URLSearchParams(location.search);
        const answerId = urlParams.get('answer');
        if (answerId) {
            fetchAnswerData(answerId);
        } else {
            navigate('/');
        }
    }, [location.search, navigate, userConnected]);

    const handleTextarea = (e) => {
        const text = e.target.value;
        setDisableBtn(text.length === 0);
        setTextarea(text);
    }

    const handleNewAnswer = async (e) => {
        e.preventDefault();
        setDisableBtn(true);
        try {
            const response = await fetch(`/api/answer/newMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    answer: answer._id,
                    reponse: textarea,
                    userConnected: userConnected,
                    userFromAnswer: user,
                }),
            });
            if (response.ok) {
                const answerData = await response.json();
                setAnswer(answerData);
                setModule(answerData.moduleId[0]);
                setReponses(answerData.answers);
                setUser(answerData.userId[0]);
                setMessages(answerData.messages);
                setTextarea("");
                setDisableBtn(false);
            } else {
                setDisableBtn(false);
                throw new Error('Failed to send answer');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteMessage = async (id) => {
        try {
            const res = await fetch(`/api/answer/deleteMessage`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messageId: id
                }),
            });
            if (!res.ok) {
                throw new Error('Failed to delete the message');
            }
            setMessages(prevMessages => prevMessages.filter(message => message._id !== id));
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="container mx-auto mt-5">
            <h1 className='text-3xl'>Réponse de l'utilisateur : <b>{user.username}</b> pour le module : <Link to={`/module?id=${module._id}`} className='text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500'>
                <b>{module.title}</b>
            </Link>
            </h1>
            <div className="border rounded-lg p-4 mb-4 shadow-lg dark:bg-gray-700 bg-gray-200">
                <h2 className="text-2xl font-bold underline italic">Réponses :</h2>

                <div className="mb-2  max-h-96 overflow-y-auto">
                    {reponses.map((reponse, index) => (
                        <div key={index} className="mb-2">
                            <p className="font-bold text-xl underline">Q{index + 1}: {reponse.question}</p>
                            <p>{reponse.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="border rounded-lg p-4 mb-4 shadow-lg dark:bg-gray-700 bg-gray-200 max-h-96 overflow-y-auto">
                <h2 className="text-2xl font-bold underline italic">Messages :</h2>
                <div className="mb-2 scroll-m-11">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`mb-2 p-2 rounded max-w-96 ${message.username === userConnected.username ? 'bg-green-200 dark:bg-green-700' : 'bg-blue-400 dark:bg-purple-800'}`}
                        >
                            <p className="text-lg font-bold italic">{message.username}</p>
                            <p className=' max-h-48 overflow-y-auto'>{message.message}</p>
                            {message.username === userConnected.username && (
                                <FaTrash className="cursor-pointer text-red-500 hover:text-red-600 " onClick={() => handleDeleteMessage(message._id)} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <form onSubmit={handleNewAnswer} className="mt-6">
                <Textarea
                    placeholder="Écrivez votre réponse ici..."
                    rows={6}
                    value={textarea}
                    onChange={handleTextarea}
                />
                <Button type='submit' disabled={disableBtn} className="mt-4">
                    Envoyer la réponse
                </Button>
            </form>
        </div>
    );
}
