import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashQuestionnaire from '../components/DashQuestionnaire';
import DashModule from '../components/DashModule';
import DashHistorique from '../components/DashHistorique';


export default function DashBoard() {
    const location = useLocation();
    const [tab, setTab]= useState('');

    useEffect(()=> {
        const urlParams = new URLSearchParams(location.search);
        const tabUrl = urlParams.get('tab');
        if(tabUrl){
            setTab(tabUrl);
        }
    }, [location.search]);
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="md:w-56">
                <DashSidebar />
            </div>
            <div className='w-screen flex justify-center sm:flex-row sm:justify-center  '>
                {tab === 'profile' && <DashProfile />}
                {tab === 'questionnaire' && <DashQuestionnaire />}
                {tab === 'module' && <DashModule />}
                {tab === 'historique' && <DashHistorique />}
            </div>
        </div>
    );
};