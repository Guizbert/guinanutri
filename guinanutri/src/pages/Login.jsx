import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../images/logo.png';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginFail, loginSuccess, loginStart } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function Login() {

  const [formData, setFormData]= useState({});
  const {loading, error: errorMessage} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate(); //pour rediriger user
  
  const handleChange = (e)=> {
    setFormData({...formData, [e.target.id]: e.target.value.trim()});
  };
  
 
  const handleSubmit = async (e)=> {
    e.preventDefault(); // empêche le refresh de la page
    if(!formData.username || !formData.password){
      return dispatch(loginFail('Tous les champs sont obligatoire'));
    }
    try{
      dispatch(loginStart());
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(loginFail(data.message));
      }
      if(res.ok){
        dispatch(loginSuccess(data));
        navigate('/dashboard?tab=questionnaire');
      }
    }catch(error) {
      dispatch(loginFail(error.message));
    }
  }
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        
        <div className='flex-1'>
          { /* cote gauche */}
          <Link to="/">
                      <img src={Logo} alt="guina nutri logo" 
                      className=' h-1/3 w-1/3  bg-opacity-0' />
          </Link>
        </div>
        <div className='flex-1'>
        { /* cote d */}
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div >
              <Label value='Pseudo'/>
              <TextInput
                type='text'
                placeholder='Pseudo'
                id='username' onChange={handleChange}/>

            </div>
            <div >
              <Label value='Mot de passe'/>
              <TextInput
                type='password'
                placeholder='*********'
                id='password' onChange={handleChange}/>

            </div>  

           
            <Button gradientDuoTone='tealToLime' type='submit'
                  disabled={loading}>
                    {
                      loading ? (
                        <>
                          <Spinner size='sm'/>
                          <span className='pl-3'>Chargement...</span>
                        </>
                      ) : 'Se connecter'
                    }
            </Button>
            <OAuth/>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Pas de compte ?</span>
            <Link to='/signup' className='text-blue-500'>
              S'inscrire
            </Link> 
          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
    )
}
