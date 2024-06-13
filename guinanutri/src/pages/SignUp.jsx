import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../images/logo.png';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import OAuth from '../components/OAuth';

export default function SignUp() {

  const [formData, setFormData]= useState({});
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setSuccess] = useState(false);
  const navigate = useNavigate(); //pour rediriger user
  useEffect(() => {
    handlePassword();
  }, [formData]); // se fait a chaque changement dans le form

  const handleChange = (e)=> {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  };
  const handlePassword = () => {
    const { password, passwdCfirm } = formData;
    if (password && passwdCfirm) {
      if (
        password !== passwdCfirm ||
        password.length < 6 ||
        !/^(?=.*[A-Z])(?=.*\d)(?=.*[-_])[\w-]+$/.test(password)
      ) {
        let errorMessage = 'Le mot de passe doit faire au moins 6 caractères et doit contenir : <ul>';
        if (password.length < 6) {
          errorMessage += '<li>Au moins 6 caractères</li>';
        }
        if(password !== passwdCfirm){
          errorMessage += '<li> Être similaire </li>';
        }
        if (!/(?=.*[A-Z])/.test(password)) {
          errorMessage += '<li>Au moins une majuscule</li>';
        }
        if (!/(?=.*\d)/.test(password)) {
          errorMessage += '<li>Au moins un chiffre</li>';
        }
        if (!/(?=.*[-_])/.test(password)) {
          errorMessage += '<li>Un "-" ou un "_"</li>';
        }
        errorMessage += '</ul>';
  
        // Utilisation de dangerouslySetInnerHTML pour rendre le HTML
        setPasswordError({ __html: errorMessage });
      } else {
        setPasswordError('');
      }
    }
  };
  
 
  const handleSubmit = async (e)=> {
    e.preventDefault(); // empêche le refresh de la page
    if(!formData.username || !formData.email || !formData.password){
      return setErrorMessage('Tous les champs sont obligatoire');
    }
    try{
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok){
        setSuccess(true);
      }
    }catch(err) {
      setErrorMessage(err.message);
      setLoading(false);
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
            <div>
              <Label value='Email'/>
              <TextInput
                type='email'
                placeholder='Email'
                id='email' onChange={handleChange}/>
            </div>  
            <div >
              <Label value='Mot de passe'/>
              <TextInput
                type='password'
                placeholder='Mot de passe'
                id='password' onChange={handleChange}/>

            </div>  
            <div>
              <Label value='Confirmation du mot de passe'/>
              <TextInput
                type='password'
                placeholder='Mot de passe'
                id='passwdCfirm' onChange={handleChange}/>

            </div>
            {passwordError && <div className='text-red-700' dangerouslySetInnerHTML={passwordError} />}

           
            <Button gradientDuoTone='tealToLime' type='submit'
                  disabled={loading}>
                    {
                      loading ? (
                        <>
                          <Spinner size='sm'/>
                          <span className='pl-3'>Chargement...</span>
                        </>
                      ) : 'Créer le compte'
                    }
            </Button>
            <OAuth/>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Déjà enregistré ?</span>
            <Link to='/login' className='text-blue-500'>
              Connectez-vous
            </Link> 
          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )
          }

          {
            showSuccess && (
              <Alert className='mt-5' color='success'>Vérifier vos mail et vos spam pour confirmer le compte</Alert>
            )
          }
        </div>
      </div>
    </div>
    )
}
