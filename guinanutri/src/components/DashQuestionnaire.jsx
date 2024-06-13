import React, { useEffect, useState } from 'react';
import { Button } from "flowbite-react";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function DashQuestionnaire() {
    const {userConnected, error} = useSelector ((state) => state.user); 

    const [questionnaires, setQuestionnaires] = useState([]);
    const [currentQuestionnaireIndex, setCurrentQuestionnaireIndex] = useState(0);
    const [currentQuestionnaire, setCurrentQuestionnaire] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userChoices, setUserChoices] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [nextDisabled, setNextDisabled] = useState(true);

    useEffect(() => {
        const fetchQuestionnaires = async () => {
            try {
                const res = await fetch("/api/questionnaire/", {
                    method: 'GET',
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch questionnaires');
                }
                const data = await res.json();
                setQuestionnaires(data);
                if (data.length > 0) {
                    setCurrentQuestionnaire(data[0]);
                    setQuestions(data[0].question);  // Ensure data has a question array
                }
                setIsLoading(false);
            } catch (e) {
                console.error('Error fetching questionnaire: ', e);
                setIsLoading(false);
            }
        };
        fetchQuestionnaires();
    }, []);

    useEffect(() => {
        // Enable the Next button if the user has made a choice
        setNextDisabled(!(userChoices[questions[currentQuestionIndex]?._id]));
    }, [userChoices, currentQuestionIndex, questions]);

    const handleChoiceChange = (choice) => {
        setUserChoices({
            ...userChoices,
            [questions[currentQuestionIndex]._id]: choice,
        });
    };

    const updateChoiceUser = async () => {
        const formData ={
            "question": questions[currentQuestionIndex]._id,
            "user": userConnected._id,
            "tag": userChoices[questions[currentQuestionIndex]._id],
        };

        try {
            const res = await fetch('/api/userChoice/newChoiceForUser',{
               method:'POST',
               headers: { 'Content-Type': 'application/json'},
               body: JSON.stringify(formData),
              });
         }catch(e){
              console.error("error while sending the choice", e);
         }
    };

    const handleNextQuestion = () => {
        updateChoiceUser();
        // Reset user choices for the current question
        setUserChoices({
            ...userChoices,
            [questions[currentQuestionIndex]._id]: undefined,
        });
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            //updateChoiceUserDB();
        } else if (currentQuestionnaireIndex < questionnaires.length - 1) {
            const nextQuestionnaireIndex = currentQuestionnaireIndex + 1;
            setCurrentQuestionnaireIndex(nextQuestionnaireIndex);
            setCurrentQuestionnaire(questionnaires[nextQuestionnaireIndex]);
            setQuestions(questionnaires[nextQuestionnaireIndex].question);
            setCurrentQuestionIndex(0);
        } else {
            alert("End of all questionnaires");
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleReset = async () => {
        try {
            const res = await fetch('/api/userChoice/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userConnected._id }), // Pass as an object
            });
            if (!res.ok) {
                console.error('Error while resetting the profile...');
            }
        } catch (error) {
            console.error('Error while resetting the profile:', error);
        }
    };
    
    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">{currentQuestionnaire ? currentQuestionnaire.title : "Questionnaire"}</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : currentQuestion ? (
                <div className="w-96 h-96 p-6 dark:bg-gray-700 bg-white rounded shadow flex flex-col justify-center items-center">
                    <h2 className="font-semibold mb-10 text-center text-2xl">{currentQuestion.body}</h2>
                    <div className="mb-4 flex items-center">
                        <label className="flex items-center">
                            <input
                                className="mr-2"
                                type="radio"
                                name="choice"
                                value="pas du tout"
                                checked={userChoices[currentQuestion._id] === 'pas du tout'}
                                onChange={() => handleChoiceChange('pas du tout')}
                            />
                            Pas du tout
                        </label>
                    </div>
                    <div className="mb-4 flex items-center">
                        <label className="flex items-center">
                            <input
                                className="mr-2"
                                type="radio"
                                name="choice"
                                value="moyennement"
                                checked={userChoices[currentQuestion._id] === 'moyennement'}
                                onChange={() => handleChoiceChange('moyennement')}
                            />
                            Moyennement
                        </label>
                    </div>
                    <div className="mb-4 flex items-center">
                        <label className="flex items-center">
                            <input
                                className="mr-2"
                                type="radio"
                                name="choice"
                                value="beaucoup"
                                checked={userChoices[currentQuestion._id] === 'beaucoup'}
                                onChange={() => handleChoiceChange('beaucoup')}
                            />
                            Beaucoup
                        </label>
                    </div>
                    <div className="flex justify-between mt-4 w-full">
                        <Button
                            disabled={currentQuestionIndex === 0}
                            onClick={handlePreviousQuestion}
                        >
                            Previous
                        </Button>
                        <Button
                            onClick={handleNextQuestion}
                            disabled={nextDisabled} // Disable the Next button if nextDisabled is true
                        >
                            {currentQuestionIndex === questions.length - 1 && currentQuestionnaireIndex === questionnaires.length - 1
                                ? "Finish"
                                : "Next"}
                        </Button>
                    </div>
                    {currentQuestionIndex === questions.length - 1 && currentQuestionnaireIndex === questionnaires.length - 1 && (
                        <Link to='/'>
                            <Button className="mt-4">
                                Accueil
                            </Button>
                        </Link>
                    )}
                </div>
            ) : (
                <p>No questions available</p>
            )}
            
            <Button onClick={handleReset} className='bg-gray-800 dark:bg-slate-700 mt-5'>Remise à 0 (pour repartir sur de bonne base)</Button>
        </div>
    );
}
