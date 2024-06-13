import React, { useEffect, useState } from 'react';
import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';
import { useSelector, useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { updateStart, updateSuccess, updateFail, 
    deleteUserStart, deleteUserSuccess, deleteUserFail,
    logoutSuccess } from '../redux/user/userSlice'; 
import Logo from '../images/logo.png';

export default function DashProfile() {
    const { userConnected, error } = useSelector((state) => state.user); 
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({});
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateError, setUpdateError] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);
    const [showDial, setShowDial] = useState(false);
    const [disableForm, setDisableForm] = useState(false);
    const { theme } = useSelector((state) => state.theme);
    const location = useLocation();
    const [editMode, setEditMode] = useState(false);

    let color = theme === 'light' ? 'redToYellow' : 'purpleToBlue';

    useEffect(() => {
        if (userConnected.isUsingGoogle || userConnected.isAdmin || userConnected.isTherapeute) {
            setDisableForm(true);
        }
    }, [userConnected]);

    const handleChanges = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserSuccess(null);
        setUpdateError(null);
        if (Object.keys(formData).length === 0) {
            setUpdateError("Aucun changement.");
            return; //check si form est vide
        }
        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${userConnected._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(updateFail(data.message));
                setUpdateError(data.message);
            } else {
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("Changement fait ! Vous allez être déconnecté");
                setTimeout(() => {
                    handleSignout();
                }, 3000);
            }
        } catch (err) {
            dispatch(updateFail(err.message));
            setUpdateError(err.message);
        }
    };

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/logout', {
                method: 'POST',
            });
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(logoutSuccess());
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    const handleDeleteUser = async () => {
        setShowDial(false);
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${userConnected._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(deleteUserFail(data.message));
            } else {
                dispatch(deleteUserSuccess(data));
            }
        } catch (err) {
            dispatch(deleteUserFail(err.message));
        }
    };

    const changeRole = async () => {
        try {
            const res = await fetch(`/api/user/changeRole`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userConnected._id }),

            });
            if (!res.ok) {
                console.error("Error while switching roles");
                return;
            }
            const response = await res.json();
            dispatch(updateSuccess(response));
            console.log("changed side");
        } catch (err) {
            console.error("Error while switching roles", err);
        }
    };
    

    const renderForm = () => {
        return (
            <form onSubmit={handleSubmit} className='flex flex-col w-3/4 text-center items-center mb-20 md:mb-10 md:w-full'>
                <TextInput type='text' id='username' placeholder='Pseudo'
                    defaultValue={userConnected.username} onChange={handleChanges}
                    className='w-full mb-4 rounded-lg bg-gray-100 border border-gray-200 focus:border-transparent focus:outline-none'
                    disabled={disableForm}
                />
                <TextInput type='email' id='email' placeholder='Email' disabled
                    defaultValue={userConnected.email} onChange={handleChanges}
                    className='w-full mb-4 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none'
                />
                <TextInput type='password' id='password' placeholder='Mot de passe'
                    onChange={handleChanges}
                    className='w-full mb-4 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none'
                    disabled={disableForm}
                />
                <TextInput type='password' id='passwordConfirmation'
                    placeholder='Confirmer le nouveau mot de passe' onChange={handleChanges}
                    className='w-full mb-4 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none'
                    disabled={disableForm}
                />
                <Button type='submit' gradientDuoTone={color} outline disabled={disableForm} className='mb-10'>
                    Mettre à jour le profile
                </Button>

                {userConnected.isAdmin ? (
                    <Button onClick={changeRole} gradientDuoTone={color}>
                        Devenir Thérapeute
                    </Button>
                ):(
                    <Button onClick={changeRole}  gradientDuoTone={color}>
                        Devenir Admin
                    </Button>
                )}
                
            </form>
        );
    };

    return (
        <div className=''>
            <div className="">
                <div className="flex flex-col items-center justify-center">
                    <h1 className='font-sans text-4xl pb-3 pt-6 text-center'>Profile</h1>
                    {renderForm()}
                </div>

                <div className="text-red-600 dark:text-red-800 flex justify-between mt-5">
                    <span onClick={() => setShowDial(true)}  hidden={disableForm} className='cursor-pointer px-3'>
                        Supprimer son compte
                    </span>
                    <Link to='/home'>
                        <span onClick={handleSignout} className='cursor-pointer px-3'>Se déconnecter</span>
                    </Link>
                </div>
                {
                    updateUserSuccess && (
                        <Alert color='success' className='mt-5'>
                            {updateUserSuccess}
                        </Alert>
                    )
                }
                {
                    updateError && (
                        <Alert color='failure' className='mt-5'>
                            {updateError}
                        </Alert>
                    )
                }
                {
                    error && (
                        <Alert color='failure' className='mt-5'>
                            {error}
                        </Alert>
                    )
                }
            </div>
            <Modal show={showDial} 
                onClose={() => setShowDial(false)} 
                popup size='md'>
                <Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <HiOutlineExclamationCircle 
                                className='h-14 w-14 text-red-400 dark:text-gray-200 mb-4 mx-auto'/>
                            <h3 className='mb-5 text-lg text-red-800 dark:text-blue-100'>
                                Voulez-vous vraiment supprimer votre compte ? 
                                Cette action est irréversible :)
                                Si vous avez pris auparavant des modules, ceux-ci ne seront plus accessibles
                            </h3>
                            <div className='flex justify-center gap-4'>
                                <Button color='failure' onClick={handleDeleteUser}>
                                    Oui
                                </Button>
                                <Button color='gray' onClick={() => setShowDial(false)}>
                                    Non
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal.Header>
            </Modal>
        </div>
    );
}
