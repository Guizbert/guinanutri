import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ImSpinner2 } from 'react-icons/im';
//import DashProfile from '../components/DashProfile';



export default function Builder() {
    const location = useLocation();
    const [settings, setSettings] = useState(null);
    const [Component, setComponent] = useState(null);

   

    return (
        <div className="flex items-center justify-center w-full h-full">
                <h1>builder </h1>
                
            {/* <ImSpinner2 className='animate-spin h-12 w-12'/> */}
        </div>
    );
}