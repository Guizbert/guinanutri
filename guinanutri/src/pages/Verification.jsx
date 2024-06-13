import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { useSelector } from 'react-redux';

export default function Verification() {
    const location = useLocation();
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const { userConnected } = useSelector((state) => state.user);

    useEffect(() => {
        // Redirect to profile if user is already connected
        if (userConnected) {
            navigate('/dashboard?tab=profile');
        }
    }, [userConnected, navigate]);

    useEffect(() => {
        // Extract the token from the query parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('code');
        if (token) {
            setToken(token);
        }
    }, [location.search]);

    const handleVerification = async () => {
        try {
            const response = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });
            const result = await response.json();
            // Handle the response, show success message, etc.
            navigate("/login");
        } catch (error) {
            console.error('Error verifying token:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center dark:bg-gray-700 bg-gray-100">
            <div className="max-w-md p-8 dark:bg-gray-600 bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-semibold text-center mb-8">Vérification de compte</h1>
                <p className="text-lg text-center mb-8">Merci de bien vérifier votre compte :</p>
                <div className="flex justify-center">
                    <Button onClick={handleVerification}>Vérifier le compte</Button>
                </div>
            </div>
        </div>
    );
}
