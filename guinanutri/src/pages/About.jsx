import React from 'react'
import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import HomeUser from './Home/HomeUser';

export default function About() {
  const {theme} = useSelector((state)=> state.theme);

  let color = theme === 'light' ? 'redToYellow' : 'purpleToBlue';

  return (
    <div className='flex flex-col items-center min-h-screen bg-scroll overflow-hidden'> 
      <h1 className='font-bold dark:text-red-500 text-red-700 text-3xl text-left md:w-1/2 mb-10'>
        Dans le cadre du TFE, il est important pour nous de vous informer que les seules informations dites personnels vous concernant sont votre adress e-mail, le résultat du questionnaire.
        Mais si besoin, vous pouvez à tout moment supprimer votre compte en allant sur : <Link to='/dashboard?tab=profile' className='text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 hover:text-blue-800' > mon compte </Link>
        Veuillez aussi prendre note que si vous avez pris un module et qu'il était payant il ne sera plus possible d'y accéder.
        Merci :)
      </h1>
      <div>
          <div className="flex flex-col items-center md:flex-row md:max-w-2xl ">
            <div className='ml-5 mb-20 dark:shadow-purple-300 shadow-lg shadow-blue-800/40 bg-yellow-100 dark:bg-purple-900 p-4 pb-1 rounded-lg mx-2 md:w-1/2 w-3/4 hover:scale-105 transition-transform duration-300'>
              <h2 className='italic font-sans font-bold text-lg pb-2 text-green-900 dark:text-white'>
                Faites le test
              </h2>
              <p className='text-wrap text-left pb-2 text-green-700 dark:text-white'>
                  Répondez à nos questions afin de nous aider à mieux cibler vos besoins.
              </p>
                <Link to='/dashboard?tab=questionnaire' className='font-sans text-lg font-bold'>
                  <Button gradientDuoTone={color} className='mx-auto font-sans text-lg font-bold'>
                      Faire le test
                  </Button>
                </Link>
            </div>
            {/* les trois cartes */}
            <div className=' ml-5 mb-20 dark:shadow-purple-300 shadow-lg shadow-blue-800/40 bg-yellow-100 dark:bg-purple-900 p-4 pb-1 rounded-lg mx-2 md:w-1/2 w-3/4 hover:scale-105 transition-transform duration-300'>
              <h2 className='italic font-sans font-bold text-lg pb-2 text-green-900 dark:text-white'>
                Résultat
              </h2>
              <p className='text-wrap text-left pb-2 text-green-700 dark:text-white'>
                Vous pourrez ainsi voir des modules (gratuit pour le moment) qui ont pour but d'expliquer pourquoi, comment cela se passe, pourquoi ça arrive...
              </p>
            </div>

          </div>
        </div>
        <div className="flex justify-center items-center h-32">
          <div className="border-t-2 rounded-lg dark:border-purple-200 border-blue-600 w-96"></div>
        </div>
        {/* notre projet */}
      <div className='flex flex-col justify-center text-lg md:w-1/2'>
        <h2 className='text-3xl text-center pb-3 underline'>Notre projet </h2>
        <p className='text-left'>
          On vous propose un test qui vous permet de voir les compléments dont
          vous avez besoin,  ainsi que des modules payants qui vous expliqueront
          les fondamentaux pour mieux comprendre votre corps  ainsi qu’un potentiel
          suivit nutritionnel avec nos professionnels de la santé.
          <span className='font-bold'>
            Pour le moment, <span className='text-green-400'> Guina Nutri </span> a été fait dans le cadre du <span className='text-red-400'> projet de fin d'étude de RAVIER Albérich</span>. Etudiant en dernière année d'informatique
            de gestion à l'EPFC à bruxelles. Il n'est pour le moment pas encore <span className='text-2xl italic text-red-600'> opérationnel </span> sur certains point. merci de votre compréhension :-)
          </span>

        </p>

      </div>
      <div className="flex justify-center items-center h-32">
        <div className="border-t-2 rounded-lg dark:border-purple-200 border-blue-600 w-96"></div>
      </div>

      <div className='flex flex-col justify-center text-lg md:w-1/2'>
        <h2 className='text-3xl text-center pb-3 underline'>Nos modules</h2>
        <p className='text-left'>
          Nos modules vous donne accès à des vidéos explicant comment et pourquoi prendre un complément. 
          Une fois fait vous pouvez répondre à un petit formulaire pour donner votre avis.
          <br />
          <span className='text-green-400 font-bold'>
              Intéressé ?
          </span>&nbsp;
          Vous pouvez voir la liste des modules disponibles &nbsp;
          <Link to='/' className='font-sans text-lg font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600'> 
            ici
          </Link>
          <br />

        </p>

      </div>
      <div className="flex justify-center items-center h-32">
        <div className="border-t-2 rounded-lg dark:border-purple-200 border-blue-600 w-96"></div>
      </div>
    </div>
  )
}
