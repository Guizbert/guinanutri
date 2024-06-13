import React from 'react';

export default function AnswerCard ({ user, answers }) {
    return (
        <div className="border rounded-lg p-4 mb-4 shadow-lg dark:bg-gray-700 bg-gray-200">
            <h2 className="text-xl font-bold mb-2">Réponse de : {user.username}</h2>
            {answers.map((answer, index) => (
                <div key={index} className="mb-2 h-24">
                    <p className="font-bold text-2xl underline italic h-10">Q{index+1} : {answer.question}</p>
                    <p>{answer.answer}</p>
                    
                </div>
            ))}
        </div>
    );
};

