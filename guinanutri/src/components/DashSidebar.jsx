import React from 'react';
import { Sidebar } from 'flowbite-react';
import {
    HiUser,HiArrowSmRight,HiDocumentText,HiOutlineUserGroup,HiAnnotation,HiChartPie,HiBookOpen,HiClipboardList 
  } from 'react-icons/hi';
  import { MdOutlineQuestionAnswer } from "react-icons/md";
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { logoutSuccess } from '../redux/user/userSlice'; 

export default function DashSidebar() {
    const location = useLocation();
    const dispatch = useDispatch();
    const { userConnected } = useSelector((state) => state.user);
    const [tab, setTab] = useState('');
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
          setTab(tabFromUrl);
        }
      }, [location.search]);

      const handleSignout = async () => {
        try{
            const res = await fetch('/api/user/logout', {
                method: 'POST',
            });
            if(!res.ok){
                console.log(data.message);
            }else {
                dispatch(logoutSuccess());
            }
        }catch(err){
            console.log(err.message);
        }
    }
    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Link to='/dashboard?tab=profile'>
                        <Sidebar.Item
                                active={tab === 'profile'} 
                                icon={HiUser} 
                                label={"user"} 
                                labelColor='dark'
                                as='div'>
                            Profile
                        </Sidebar.Item>
                    </Link>
                        <Link to='/dashboard?tab=module'>
                            <Sidebar.Item  
                                active={tab === 'module'} 
                                icon={HiBookOpen} 
                                label={"modules"} 
                                labelColor='pink'
                                as='div'>
                                Mes modules
                            </Sidebar.Item>
                        </Link>
                        <Link to='/dashboard?tab=questionnaire'>
                            <Sidebar.Item  
                                active={tab === 'questionnaire'} 
                                icon={HiClipboardList} 
                                label={"test"} 
                                labelColor='green'
                                as='div'>
                                Faire le test
                            </Sidebar.Item>
                        </Link>
                        <Link to='/dashboard?tab=historique'>
                            <Sidebar.Item  
                                active={tab === 'historique'} 
                                icon={MdOutlineQuestionAnswer} 
                                label={"historique"} 
                                labelColor='purple'
                                as='div'>
                                Historique
                            </Sidebar.Item>
                        </Link>
                    <Sidebar.Item 
                        icon={HiArrowSmRight} 
                        className='cursor-pointer'
                        as='div'
                        onClick={handleSignout}>
                        Se déconnecter
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
};

