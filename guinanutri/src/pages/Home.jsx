import React from 'react';
import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import HomeUser from './Home/HomeUser';
import HomeAdmin from './Home/HomeAdmin';

export default function Home() {
  const {userConnected, error} = useSelector ((state) => state.user); 

/**
 *  
 */

  if(userConnected){
    if (userConnected.isAdmin || userConnected.isTherapeute) {
      return <HomeAdmin />;
    }
    else{
      return <HomeUser />
    }
  }
  return <HomeUser />;
  
  // return (
  //   <div className='flex flex-col items-center min-h-screen bg-scroll'> 
    
  //   </div>
  // );
}
