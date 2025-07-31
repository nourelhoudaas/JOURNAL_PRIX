import React, { useState, useEffect } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

export default function MultiStepForm({ currentUserId }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [themes, setThemes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetch('http://localhost:8000/profile', {
          credentials: 'include',
        });
      } catch (error) {
        console.error('❌ Auth error :', error);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch('http://localhost:8000/form-data', {
          credentials: 'include',
          headers: { 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error('Erreur données');
        const data = await response.json();
        setThemes(data.themes || []);
        setCategories(data.categories || []);
        setFormData((prev) => ({ ...prev, userId: data.userId }));
      } catch (error) {
        console.error('❌ Erreur chargement des données :', error);
      }
    };
    fetchFormData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      if (name === 'carte_nationale' && files[0].size > 10 * 1024 * 1024) {
        setError('La carte nationale ne doit pas dépasser 10 Mo.');
        return;
      }
      if (name === 'photo' && files[0].size > 5 * 1024 * 1024) {
        setError('La photo ne doit pas dépasser 5 Mo.');
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setError('');
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      const form = new FormData();
      for (const key in formData) {
        form.append(key, formData[key]);
      }
      try {
        await fetch('http://localhost:8000/sanctum/csrf-cookie', {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1];

        const res = await fetch('http://localhost:8000/soumission/store-step1', {
          method: 'POST',
          body: form,
          credentials: 'include',
          headers: {
            'X-XSRF-TOKEN': decodeURIComponent(token),
            'Accept': 'application/json',
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.error || `Erreur HTTP ${res.status}`);
          return;
        }

        const result = await res.json();
        setFormData((prev) => ({ ...prev, userId: result.id_personne || prev.userId }));
        setError('');
        setStep(2);
      } catch (error) {
        setError(error.message || 'Erreur de soumission.');
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setError('');
    setStep((prev) => prev - 1);
  };

  const stepTitles = ['Sign Up', 'Message', 'Confirm'];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <Step1 data={formData} onChange={handleChange} onFileChange={handleFileChange} onNext={nextStep} error={error} />;
      case 2:
        return <Step2 data={formData} onChange={handleChange} onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <Step3 data={formData} onChange={handleChange} onBack={prevStep} userId={formData.userId} themes={themes} categories={categories} />;
      default:
        return <div className="text-center text-green-600 text-xl font-bold">✅ Formulaire terminé !</div>;
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      
      <div className="flex-grow flex flex-col items-center justify-start p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between">
            {stepTitles.map((title, index) => {
              const stepIndex = index + 1;
              return (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold mb-1
                      ${step === stepIndex ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-black'}`}
                  >
                    {stepIndex}
                  </div>
                  <span className={`text-xs ${step === stepIndex ? 'text-indigo-600 font-semibold' : 'text-gray-500'}`}>{title}</span>
                </div>
              );
            })}
          </div>
          <div className="p-8">{renderStepContent()}</div>
        </div>
      </div>
    </div>
  );
}
