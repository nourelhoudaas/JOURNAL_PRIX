// MultiStepForm.jsx
import React, { useState, useEffect } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState({
    id_nin_personne: '',
    nom_personne_fr: '',
    prenom_personne_fr: '',
    nom_personne_ar: '',
    prenom_personne_ar: '',
    date_naissance: '',
    lieu_naissance_fr: '',
    lieu_naissance_ar: '',
    nationalite_fr: 'Algerienne',
    nationalite_ar: 'جزائرية',
    num_tlf_personne: '',
    adresse_fr: '',
    adresse_ar: '',
    sexe_personne_fr: '',
    sexe_personne_ar: '',
    groupage: '',
    carte_nationale: null,
    photo: null,
    id_professional_card: '',
    fonction_fr: '',
    fonction_ar: '',
    fichiers: [],
  });
  const [formData, setFormData] = useState({
    userId: null,
    themes: [],
    categories: [],
    id_professional_card: '',
    num_attes: '',
    fonction_fr: '',
    fonction_ar: '',
    secteur_travail: '',
    categorie: '',
    type_media: '',
    tv: '',
    radio: '',
    media: '',
    langue: '',
    specialite: '',
    nom_etablissement: '',
    nom_etablissement_ar: '',
    email: '',
    tel: '',
    attestation_travail: null,
    fichiers: [],
  });
  const [wilayas, setWilayas] = useState([]);
  const [error, setError] = useState('');
  const [wilayasError, setWilayasError] = useState('');
  const [isLoadingWilayas, setIsLoadingWilayas] = useState(true);
  const [isProfessionalCardValidated, setIsProfessionalCardValidated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:8000/profile', {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error('Erreur d\'authentification');
      } catch (error) {
        console.error('❌ Erreur d\'authentification :', error);
        setError('Erreur lors de la vérification de l\'authentification.');
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch('http://localhost:8000/form-data', {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error('Erreur données');
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          userId: data.userId,
          themes: data.themes || [],
          categories: data.categories || [],
        }));
      } catch (error) {
        console.error('❌ Erreur chargement des données :', error);
        setError('Erreur lors du chargement des données du formulaire.');
      }
    };
    fetchFormData();
  }, []);

  useEffect(() => {
    const fetchWilayas = async () => {
      try {
        setIsLoadingWilayas(true);
        const response = await fetch('http://localhost:8000/wilayas', {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setWilayas(data);
        setWilayasError('');
        setIsLoadingWilayas(false);
      } catch (error) {
        console.error('❌ Erreur chargement des wilayas :', error);
        setWilayasError('Impossible de charger les wilayas. Veuillez réessayer.');
        setIsLoadingWilayas(false);
      }
    };
    fetchWilayas();
  }, []);

  const handleStep1Change = (e) => {
    if (e.target.name === 'batch') {
      setStep1Data((prev) => ({
        ...prev,
        ...e.target.value,
      }));
    } else {
      const { name, value } = e.target;
      setStep1Data((prev) => ({ ...prev, [name]: value }));
    }
    setError('');
  };

  const handleStep2Change = (e) => {
    if (e.target.name === 'batch') {
      setFormData((prev) => ({
        ...prev,
        ...e.target.value,
      }));
    } else {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === 'secteur_travail' && value === 'Privé' ? { categorie: 'Privé' } : {}), // Utilisation exacte de "Privé" comme dans le schéma SQL
        ...(name === 'secteur_travail' && value === 'Public' ? { categorie: '' } : {}),
      }));
    }
    setError('');
    setIsProfessionalCardValidated(false);
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
      if (name === 'attestation_travail' && files[0].size > 10 * 1024 * 1024) {
        setError('L\'attestation de travail ne doit pas dépasser 10 Mo.');
        return;
      }
      if (name === 'carte_nationale' || name === 'photo') {
        setStep1Data((prev) => ({ ...prev, [name]: files[0] }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
      }
      setError('');
    }
  };

  const handleStep3Change = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateStep1 = () => {
    if (!step1Data.id_nin_personne) {
      setError('Le numéro NIN est requis.');
      return false;
    }
    if (step1Data.id_nin_personne.length !== 18) {
      setError('Le numéro NIN doit contenir exactement 18 chiffres.');
      return false;
    }
    if (!/^[0-9]{18}$/.test(step1Data.id_nin_personne)) {
      setError('Le numéro NIN doit être composé uniquement de chiffres.');
      return false;
    }
    if (!step1Data.nom_personne_fr) {
      setError('Veuillez entrer le nom (FR).');
      return false;
    }
    if (!step1Data.prenom_personne_fr) {
      setError('Veuillez entrer le prénom (FR).');
      return false;
    }
    if (!step1Data.nom_personne_ar) {
      setError('Veuillez entrer le nom (AR).');
      return false;
    }
    if (!step1Data.prenom_personne_ar) {
      setError('Veuillez entrer le prénom (AR).');
      return false;
    }
    if (!step1Data.date_naissance) {
      setError('Veuillez entrer la date de naissance.');
      return false;
    }
    if (!step1Data.lieu_naissance_fr) {
      setError('Veuillez sélectionner le lieu de naissance (FR).');
      return false;
    }
    if (!step1Data.lieu_naissance_ar) {
      setError('Veuillez sélectionner le lieu de naissance (AR).');
      return false;
    }
    if (!step1Data.nationalite_fr) {
      setError('Le champ nationalité (FR) est requis.');
      return false;
    }
    if (!step1Data.nationalite_ar) {
      setError('Le champ nationalité (AR) est requis.');
      return false;
    }
    if (!step1Data.num_tlf_personne || !/^[0-9]{10}$/.test(step1Data.num_tlf_personne)) {
      setError('Veuillez entrer un numéro de téléphone valide (10 chiffres).');
      return false;
    }
    if (!step1Data.adresse_fr) {
      setError('Veuillez entrer l’adresse (FR).');
      return false;
    }
    if (!step1Data.adresse_ar) {
      setError('Veuillez entrer l’adresse (AR).');
      return false;
    }
    if (!step1Data.sexe_personne_fr) {
      setError('Veuillez sélectionner le sexe (FR).');
      return false;
    }
    if (!step1Data.sexe_personne_ar) {
      setError('Veuillez sélectionner le sexe (AR).');
      return false;
    }
    if (!step1Data.groupage) {
      setError('Veuillez sélectionner le groupe sanguin.');
      return false;
    }
    if (!step1Data.carte_nationale && (!step1Data.fichiers || !step1Data.fichiers.some(f => f.type === 'carte_nationale'))) {
      setError('Veuillez uploader la carte nationale.');
      return false;
    }
    if (!step1Data.photo && (!step1Data.fichiers || !step1Data.fichiers.some(f => f.type === 'photo'))) {
      setError('Veuillez uploader la photo.');
      return false;
    }
    return true;
  };

  const validateStep2 = async () => {
    if (!formData.id_professional_card) {
      setError('Le numéro de carte professionnelle est requis.');
      return false;
    }
    if (!formData.num_attes) {
      setError("La référence de l'attestation de travail est requise.");
      return false;
    }
    if (!formData.fonction_fr) {
      setError('La fonction (FR) est requise.');
      return false;
    }
    if (!formData.fonction_ar) {
      setError('La fonction (AR) est requise.');
      return false;
    }
    if (!formData.secteur_travail) {
      setError('Le secteur de travail est requis.');
      return false;
    }
    if (formData.secteur_travail === 'Public') {
      if (!formData.categorie) {
        setError('La catégorie est requise.');
        return false;
      }
      if (formData.categorie === 'Média audio' && !formData.type_media) {
        setError('Le type de média est requis.');
        return false;
      }
      if (formData.type_media === 'TV' && !formData.tv) {
        setError('Le TV est requis.');
        return false;
      }
      if (formData.type_media === 'Radio' && !formData.radio) {
        setError('Le radio est requis.');
        return false;
      }
      if (formData.categorie === 'Média écrit et électronique' && !formData.media) {
        setError('Le type de média écrit est requis.');
        return false;
      }
      if ((formData.type_media === 'TV' || formData.media) && !formData.specialite) {
        setError('La spécialité est requise.');
        return false;
      }
    }
    if (formData.secteur_travail === 'Privé') {
      if (formData.categorie !== 'Privé') {
        setError('La catégorie doit être "Privé" pour le secteur privé.');
        return false;
      }
      if (!formData.langue) {
        setError('La langue est requise.');
        return false;
      }
      if (!formData.specialite) {
        setError('La spécialité est requise.');
        return false;
      }
    }
    if (!formData.nom_etablissement) {
      setError("Le nom de l'établissement (FR) est requis.");
      return false;
    }
    if (!formData.nom_etablissement_ar) {
      setError("Le nom de l'établissement (AR) est requis.");
      return false;
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("L'email est invalide.");
      return false;
    }
    if (!formData.tel || !/^(\+?\d{8,15})$/.test(formData.tel)) {
      setError('Le téléphone est invalide.');
      return false;
    }
    if (!formData.attestation_travail && (!formData.fichiers || !formData.fichiers.some(f => f.type === 'attestation_travail'))) {
      setError("L'attestation de travail est requise.");
      return false;
    }
    return true;
  };

  const nextStep = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (step === 1) {
      if (!validateStep1()) return;

      const form = new FormData();
      for (const key in step1Data) {
        if (step1Data[key] !== null && step1Data[key] !== undefined && step1Data[key] !== '' && key !== 'fichiers') {
          form.append(key, step1Data[key]);
        }
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

        const res = await fetch('http://localhost:8000/soumission/step1', {
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
        console.error('Erreur fetch :', error);
        setError(error.message || 'Erreur de soumission.');
      }
    } else if (step === 2) {
      if (!validateStep2()) return;

      const form = new FormData();
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '' && key !== 'fichiers') {
          form.append(key, formData[key]);
        }
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

        const res = await fetch('http://localhost:8000/soumission/step2', {
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
          const errorMessages = errorData.errors
            ? Object.values(errorData.errors).flat().join(' ')
            : errorData.error || `Erreur HTTP ${res.status}`;
          setError(errorMessages);
          return;
        }

        setError('');
        setStep(3);
      } catch (error) {
        console.error('Erreur fetch :', error);
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-8">
      <div className="flex-grow flex flex-col items-center justify-start p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
              <li
                className={`flex md:w-full items-center ${step === 1 || step > 1 ? 'text-blue-600 dark:text-blue-500' : ''} sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}
              >
                <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                  {step > 1 ? (
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                  ) : (
                    <span className="me-2">1</span>
                  )}
                  Informations <span className="hidden sm:inline-flex sm:ms-2">Personnelles</span>
                </span>
              </li>
              <li
                className={`flex md:w-full items-center ${step === 2 || step > 2 ? 'text-blue-600 dark:text-blue-500' : ''} sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}
              >
                <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                  {step > 2 ? (
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                  ) : (
                    <span className="me-2">2</span>
                  )}
                  Compte <span className="hidden sm:inline-flex sm:ms-2">Info</span>
                </span>
              </li>
              <li className={`flex items-center ${step === 3 ? 'text-blue-600 dark:text-blue-500' : ''}`}>
                <span className="flex items-center">
                  {step > 3 ? (
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                  ) : (
                    <span className="me-2">3</span>
                  )}
                  Confirmation
                </span>
              </li>
            </ol>
          </div>
          <div>{renderStepContent()}</div>
        </div>
      </div>
    </div>
  );

  function renderStepContent() {
    switch (step) {
      case 1:
        return (
          <Step1
            data={step1Data}
            onChange={handleStep1Change}
            onFileChange={handleFileChange}
            onNext={nextStep}
            error={error || wilayasError}
            wilayas={wilayas}
            isLoadingWilayas={isLoadingWilayas}
          />
        );
      case 2:
        return (
          <Step2
            data={formData}
            onChange={handleStep2Change}
            onFileChange={handleFileChange}
            onCheckProfessionalCard={validateStep2}
            onNext={nextStep}
            onBack={prevStep}
            error={error}
            setIsProfessionalCardValidated={setIsProfessionalCardValidated}
          />
        );
      case 3:
        return (
          <Step3
            data={formData}
            onChange={handleStep3Change}
            onBack={prevStep}
            userId={formData.userId}
            themes={formData.themes}
            categories={formData.categories}
          />
        );
      default:
        return <div className="text-center text-green-600 text-xl font-bold">✅ Formulaire terminé !</div>;
    }
  }
}