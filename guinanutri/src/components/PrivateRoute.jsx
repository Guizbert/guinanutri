import React from 'react';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Outlet , Navigate} from 'react-router-dom';

export default function PrivateRoute(){
    // Vérifier si l'utilisateur est connecté ou non
    const {userConnected} = useSelector((state) => state.user);

    return userConnected ? <Outlet /> : <Navigate to='/login' />
};

