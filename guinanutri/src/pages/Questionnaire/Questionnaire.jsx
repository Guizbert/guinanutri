import React, { useEffect, useState } from 'react';
import { Button, Select, Textarea } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FormBuilder from '../../components/dndkit/FormBuilder';

export default function Questionnaire() {
  const { userConnected } = useSelector((state) => state.user);
  const [formAdvanced, setFormAdvanced] = useState(false);
  const [rangeValue, setRangeValue] = useState(3);
  const [module, setModule] = useState("");
  const navigate = useNavigate();
  const [tab, setTab] = useState('');
  const [formElem, setFormElem] = useState([]);
  const [canSave, setCanSave]= useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabUrl = urlParams.get('module');
    if (tabUrl) {
      setTab(tabUrl);
    }
  }, []);

  useEffect(() => {
    const getModuleById = async (moduleId) => {
      try {
        const response = await fetch(`/api/module/${moduleId}`);
        if (response.ok) {
          const moduleData = await response.json();
          setModule(moduleData);
        } else {
          throw new Error('Failed to fetch module');
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (tab) {
      getModuleById(tab);
    }
  }, [tab]);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setFormAdvanced(value);
  };

  const handleRangeChange = (event) => {
    setRangeValue(Number(event.target.value));
  };

  const updateFormElem = async (elem) => {
    setFormElem(elem);
    console.log(elem.length);
    if(elem.length > 0)
      setCanSave(true);
    else
    setCanSave(false);

  };

  const handleAdvancedSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/form/newForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: module.title,
          formElem: formElem,
          module: module._id,
          user: userConnected,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        const linkResponse = await fetch('/api/module/addFormToModule', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            moduleId: module._id,
            formId: data.form._id,
          }),
        });

        if (linkResponse.ok) {
          navigate('/');
        } else {
          throw new Error('Failed to link form to module');
        }
      } else {
        throw new Error('Failed to create form');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  if (userConnected.isAdmin || userConnected.isTherapeute) {
    return (
      <div className="p-4 text-center">
        {tab ? (
          <h1 className="text-xl font-bold">Modification du formulaire pour le module : {module.title}</h1>
        ) : (
          <h1 className="text-xl font-bold">Création d'un nouveau formulaire</h1>
        )}

        <form onSubmit={handleAdvancedSubmit} className='w-1/2 mx-auto mt-4'>
          <FormBuilder onUpdateForm={updateFormElem} title={module.title} />
          <Button type="submit" disabled={!canSave} className="mt-4">Submit to add the form</Button>
        </form>
        
      </div>
    );
  } else {
    navigate('/');
  }
}
