import { Avatar, Button, Dropdown, Navbar, Checkbox } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { FaMoon, FaSun, FaBell } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { logoutSuccess } from '../redux/user/userSlice';
import Logo from '../images/logo.png';
import { TiInputChecked } from "react-icons/ti";
import { FaTrash } from "react-icons/fa";

import './Header.css';

export default function Header() {
    const path = useLocation().pathname;
    const { userConnected } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.theme);
    const [notifications, setNotifications] = useState([]);
    const [showAll, setShowAll] = useState(false);

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/logout', {
                method: 'POST',
            });
            if (!res.ok) {
                console.log(res.message);
            } else {
                dispatch(logoutSuccess());
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/user/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userConnected._id }),
            });

            if (!res.ok) {
                console.log(res);
                throw new Error('Failed to fetch notifications');
            }

            const data = await res.json();
            setNotifications(data.notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        if (userConnected) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 120000); // 2 minutes
            return () => clearInterval(interval); // Cleanup interval on unmount
        }
    }, [userConnected]);

    const readNotif = async (notifId) => {
        const formData = {
            notification: notifId,
            userConnected: userConnected,
        }
        try {
            const res = await fetch(`/api/user/readNotif`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ formData }),
            });
            if (!res.ok) {
                throw new Error('Failed to mark notification as read');
            }

            setNotifications(notifications.map(notif =>
                notif._id === notifId ? { ...notif, isRead: true } : notif
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };
    const handleDeleteNotif = async (notifAnswer) => {
        console.log(notifAnswer);
        const formData= {
            notification: notifAnswer,
            userConnected: userConnected,
        }
        try {
            const res = await fetch(`/api/user/deleteNotification`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ formData}),
            });

            if (!res.ok) {
                throw new Error('Failed to delete notification');
            }

            setNotifications(notifications.filter(notif => notif._id !== notifAnswer));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    }

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of the year
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} (${hours}h${minutes})`;
    };

    return (
        <Navbar className='border-b-2'>
            <Link to="/" className='hidden md:block'>
                <img src={Logo} alt="guina nutri logo" className='h-1/6 w-1/6 bg-opacity-0' />
            </Link>
            <div className="flex flex-row gap-1 md:order-2">
                <Button className='w-12 h-10' color={theme === 'light' ? 'yellow' : 'purple'} pill onClick={() => dispatch(toggleTheme())}>
                    {theme === 'light' ? <FaSun /> : <FaMoon />}
                </Button>
                {userConnected ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <div className="relative">
                                <FaBell className="text-2xl" />
                                {notifications.filter(notif => !notif.isRead).length > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full" style={{ fontSize: '0.7rem', padding: '0.1rem 0.3rem' }}>
                                        {notifications.filter(notif => !notif.isRead).length}
                                    </span>
                                )}
                            </div>
                        }
                    >
                        <Dropdown.Header>
                            <span className='block text-sm'>Notifications</span>
                            <div className='flex items-center gap-2'>
                                <Checkbox
                                    id="showAll"
                                    name="showAll"
                                    checked={showAll}
                                    onChange={() => setShowAll(!showAll)}
                                />
                                <label htmlFor="showAll">Voir toutes les notifications</label>
                            </div>
                        </Dropdown.Header>
                        {notifications.length > 0 ? (
                            notifications
                                .filter(notification => showAll || !notification.isRead)
                                .map((notification) => (
                                    <Dropdown.Item className={`${notification.isRead ? '' : ' '}`} key={notification._id}>
                                        <div className="flex items-center justify-between w-full">
                                            <Link to={`/reponse?answer=${notification.answerId}`} onClick={() => readNotif(notification._id)} className="flex items-center flex-grow">
                                                <p className="mr-2">{notification.message}</p>
                                                <span className='text-xs'>{formatDate(notification.timestamp)}</span>
                                            </Link>
                                            {notification.isRead && (
                                                <div className="flex items-center ml-2">
                                                    <div className="text-xl text-green-500 dark:text-green-400">
                                                        <TiInputChecked />
                                                    </div>
                                                    <FaTrash className="cursor-pointer text-lg text-red-500 hover:text-red-600 ml-2" onClick={() => handleDeleteNotif(notification._id)} />
                                                </div>
                                            )}
                                        </div>
                                    </Dropdown.Item>
                                ))
                        ) : (
                            <Dropdown.Item>Aucune notification</Dropdown.Item>
                        )}
                    </Dropdown>
                ) : null}
                {userConnected ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar
                                className='px-2'
                                placeholderInitials={userConnected.username.substring(0, 2).toUpperCase()}
                                rounded
                                alt='profile'
                                bordered
                                color='gray'
                            />
                        }
                    >
                        <Dropdown.Header>
                            <span className='block text-sm'> {userConnected.username}</span>
                            <span className='block text-sm font-medium truncate'> {userConnected.email}</span>
                        </Dropdown.Header>
                        <Link to={'/dashboard?tab=profile'}>
                            <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleSignout}>Se déconnecter</Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to='/login'>
                        <Button color='gray' pill>Se connecter</Button>
                    </Link>
                )}
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link active={path === "/"} as={'div'}>
                    <Link to='/'>Home</Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/about"} as={'div'}>
                    <Link to='/about'>About</Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}
