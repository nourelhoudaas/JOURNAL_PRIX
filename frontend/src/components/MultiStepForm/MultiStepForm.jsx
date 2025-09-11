import React, { useState, useEffect } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

export default function MultiStepForm({ interfaceLocale, setInterfaceLocale, direction }) {
  const [step, setStep] = useState(1);
  const [translations, setTranslations] = useState({}); // État pour stocker les traductions
  const [translationError, setTranslationError] = useState(''); // Erreur pour la récupération des traductions

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
    titre_oeuvre_fr: '',
    titre_oeuvre_ar: '',
    descriptif_oeuvre_fr: '',
    descriptif_oeuvre_ar: '',
    date_publication: '',
    video_url: '',
  });

  const [wilayas, setWilayas] = useState([]);
  const [error, setError] = useState('');
  const [wilayasError, setWilayasError] = useState('');
  const [isLoadingWilayas, setIsLoadingWilayas] = useState(true);
  const [isProfessionalCardValidated, setIsProfessionalCardValidated] = useState(false);

  // Charger les traductions depuis le backend
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch(`http://localhost:8000/translations/${interfaceLocale}`, {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des traductions');
        }
        const data = await response.json();
        setTranslations(data);
        setTranslationError('');
      } catch (error) {
        console.error('Erreur lors du chargement des traductions :', error);
        setTranslationError('Impossible de charger les traductions.');
        // Revenir à la langue par défaut (fr) si erreur
        if (interfaceLocale !== 'fr') {
          setInterfaceLocale('fr');
        }
      }
    };

    fetchTranslations();
  }, [interfaceLocale, setInterfaceLocale]);

  // Vérification de l'authentification
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:8000/profile', {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error('Erreur d\'authentification');
      } catch (error) {
        console.error("❌ Erreur d'authentification :", error);
        setError(
          translations.required?.replace(':attribute', 'authentification') ||
          'Le champ authentification est requis.'
        );
      }
    };
    checkAuth();
  }, [translations]);

  // Charger les données du formulaire
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
        console.error("❌ Erreur chargement des données :", error);
        setError(
          translations.required?.replace(':attribute', 'données du formulaire') ||
          'Le champ données du formulaire est requis.'
        );
      }
    };
    fetchFormData();
  }, [translations]);

  // Charger les wilayas
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
        console.error("❌ Erreur chargement des wilayas :", error);
        setWilayasError(
          translations.required?.replace(':attribute', 'wilayas') ||
          'Le champ wilayas est requis.'
        );
        setIsLoadingWilayas(false);
      }
    };
    fetchWilayas();
  }, [translations]);

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
        ...(name === 'secteur_travail' && value === 'Privé' ? { categorie: 'Privé', type_media: 'Privé' } : {}),
        ...(name === 'secteur_travail' && value === 'Public' ? { categorie: '', type_media: '' } : {}),
      }));
    }
    setError('');
    setIsProfessionalCardValidated(false);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      if (name === 'carte_nationale' && files[0].size > 10 * 1024 * 1024) {
        setError(
          translations.required?.replace(
            ':attribute',
            translations.carte_nationale || 'carte nationale (taille max 10 Mo)'
          ) || 'Le champ carte nationale est requis.'
        );
        return;
      }
      if (name === 'photo' && files[0].size > 5 * 1024 * 1024) {
        setError(
          translations.required?.replace(
            ':attribute',
            translations.photo || 'photo (taille max 5 Mo)'
          ) || 'Le champ photo est requis.'
        );
        return;
      }
      if (name === 'attestation_travail' && files[0].size > 10 * 1024 * 1024) {
        setError(
          translations.required?.replace(
            ':attribute',
            translations.attestation_travail || 'attestation de travail (taille max 10 Mo)'
          ) || 'Le champ attestation de travail est requis.'
        );
        return;
      }
      if (name === 'file') {
        const maxSize = 100 * 1024 * 1024; // 100 Mo
        for (let i = 0; i < files.length; i++) {
          if (files[i].size > maxSize) {
            setError(
              translations.max_video_size?.replace(
                ':attribute',
                `fichier ${files[i].name}`
              ) || 'La taille du fichier ne doit pas dépasser 100 Mo.'
            );
            return;
          }
        }
        setFormData((prev) => ({
          ...prev,
          fichiers: Array.from(files).map((file) => ({ type: 'file', file })),
        }));
      } else if (name === 'carte_nationale' || name === 'photo') {
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
      setError(
        translations.required?.replace(
          ':attribute',
          translations.id_nin_personne || 'Numéro NIN'
        ) || 'Le champ Numéro NIN est requis.'
      );
      return false;
    }
    if (step1Data.id_nin_personne.length !== 18 || !/^[0-9]{18}$/.test(step1Data.id_nin_personne)) {
      setError(translations.nin_invalid || 'Le numéro NIN doit contenir 18 chiffres.');
      return false;
    }
    if (!step1Data.nom_personne_fr) {
      setError(
        translations.required?.replace(
          ':attribute',
          translations.nom_personne_fr || 'Nom (FR)'
        ) || 'Le champ Nom (FR) est requis.'
      );
      return false;
    }
    if (!step1Data.prenom_personne_fr) {
      setError(
        translations.required?.replace(
          ':attribute',
          translations.prenom_personne_fr || 'Prénom (FR)'
        ) || 'Le champ Prénom (FR) est requis.'
      );
      return false;
    }
    if (!step1Data.nom_personne_ar) {
      setError(
        translations.required?.replace(
          ':attribute',
          translations.nom_personne_ar || 'Nom (AR)'
        ) || 'Le champ Nom (AR) est requis.'
      );
      return false;
    }
    if (!step1Data.prenom_personne_ar) {
      setError(
        translations.required?.replace(
          ':attribute',
          translations.prenom_personne_ar || 'Prénom (AR)'
        ) || 'Le champ Prénom (AR) est requis.'
      );
      return false;
    }
    if (!step1Data.date_naissance) {
      setError(
        translations.required?.replace(
          ':attribute',
          translations.date_naissance || 'Date de naissance'
        ) || 'Le champ Date de naissance est requis.'
      );
      return false;
    }
    if (!step1Data.lieu_naissance_fr) {
      setError(
        translations.required?.replace(
          ':attribute',
          translations.lieu_naissance_fr || 'Lieu de naissance (FR)'
        ) || 'Le champ Lieu de naissance (FR) est requis.'
      );
      return false;
    }
    if (!step1Data.lieu_naissance_ar) {
      setError(
        translations.required?.replace(
          ':attribute',
          translations.lieu_naissance_ar || 'Lieu de naissance (AR)'
        ) || 'Le champ Lieu de naissance (AR) est requis.'
      );
      return false;
    }
    if (!step1Data.nationalite_fr) {
      setError(
        translations.required?.replace(
          ':attribute',
          translations.nationalite_fr || 'Nationalité (FR)'
        ) || 'Le champ Nationalité (FR) est requis.'
      );
      return false;
    }
    if (!step1Data.nationalite_ar) {
      setError(
        translations.required?.replace(
          ':attribute',
          translations.nationalite_ar || 'Nationalité (AR)'
        ) || 'Le champ Nationalité (AR) est requis.'
      );
      return false;
    }
    if (!step1Data.num_tlf_personne || !/^[0-9]{10}$/.test(step1Data.num_tlf_personne)) {
      setError(translations.phone_invalid || 'Le numéro de téléphone doit contenir entre 8 et 15 chiffres.');
      return false;
    }
    if (!step1Data.adresse_fr) {
      setError(
        translations.required?.replace(
          ':attribute',
          translations.adresse_fr || 'Adresse (FR)'
        ) || 'Le champ Adresse (FR) est requis.'
      );
      return false;
    }
    if (!step1Data.adresse_ar) {
      setError(
        translations.required?.replace(
          ':attribute',
          translations.adresse_ar || 'Adresse (AR)'
        ) || 'Le champ Adresse (AR) est requis.'
      );
      return false;
    }
    if (!step1Data.sexe_personne_fr) {
      setError(
        translations.required?.replace(
          ':attribute',
          translations.sexe_personne_fr || 'Sexe (FR)'
        ) || 'Le champ Sexe (FR) est requis.'
      );
      return false;
    }
    if (!step1Data.sexe_personne_ar) {
      setError(
        translations.required?.replace(
          ':attribute',
          translations.sexe_personne_ar || 'Sexe (AR)'
        ) || 'Le champ Sexe (AR) est requis.'
      );
      return false;
    }
    if (!step1Data.groupage) {
      setError(
        translations.required?.replace(
          ':attribute',
          translations.groupage || 'Groupe sanguin'
        ) || 'Le champ Groupe sanguin est requis.'
      );
      return false;
    }
    if (
      !step1Data.carte_nationale &&
      (!step1Data.fichiers || !step1Data.fichiers.some((f) => f.type === 'carte_nationale'))
    ) {
      setError(
        translations.required?.replace(
          ':attribute',
          translations.carte_nationale || 'Carte nationale'
        ) || 'Le champ Carte nationale est requis.'
      );
      return false;
    }
    if (
      !step1Data.photo &&
      (!step1Data.fichiers || !step1Data.fichiers.some((f) => f.type === 'photo'))
    ) {
      setError(
        translations.required?.replace(
          ':attribute',
          translations.photo || 'Photo'
        ) || 'Le champ Photo est requis.'
      );
      return false;
    }
    return true;
  };

  const validateStep2 = async () => {
    if (!formData.id_professional_card) {
      setError(
        translations.required?.replace(
          ':attribute',
          translations.id_professional_card || 'Numéro de carte professionnelle'
        ) || 'Le champ Numéro de carte professionnelle est requis.'
      );
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
      form.append('locale', interfaceLocale);
      try {
        await fetch('http://localhost:8000/sanctum/csrf-cookie', {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1];
        const res = await fetch('http://localhost:8000/soumission/step1', {
          method: 'POST',
          body: form,
          credentials: 'include',
          headers: {
            'X-XSRF-TOKEN': decodeURIComponent(token),
            Accept: 'application/json',
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
        setError(
          error.message ||
          translations.required?.replace(':attribute', 'soumission') ||
          'Le champ soumission est requis.'
        );
      }
    } else if (step === 2) {
      if (!(await validateStep2())) return;
      const form = new FormData();
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '' && key !== 'fichiers') {
          form.append(key, formData[key]);
        }
      }
      form.append('type_media', formData.type_media || '');
      form.append('locale', interfaceLocale);
      try {
        await fetch('http://localhost:8000/sanctum/csrf-cookie', {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1];
        const res = await fetch('http://localhost:8000/soumission/step2', {
          method: 'POST',
          body: form,
          credentials: 'include',
          headers: {
            'X-XSRF-TOKEN': decodeURIComponent(token),
            Accept: 'application/json',
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
        setError(
          error.message ||
          translations.required?.replace(':attribute', 'soumission') ||
          'Le champ soumission est requis.'
        );
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
            <ol
              className={`flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base ${direction === 'rtl' ? 'flex-row-reverse space-x-reverse space-x-6' : 'flex-row space-x-6'}`}
              style={{ direction: direction === 'rtl' ? 'rtl !important' : 'ltr' }}
            >
              <li
                className={`${interfaceLocale === 'ar'
                  ? 'flex items-center'
                  : "flex md:w-full items-center sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mr-8 xl:after:mr-12 dark:after:border-gray-700"
                  } ${step === 1 || step > 1 ? 'text-blue-600 dark:text-blue-500' : ''}`}
              >
                <span
                  className={`flex items-center after:content-['/'] sm:after:hidden ${direction === 'rtl' ? 'after:mr-3' : 'after:ml-3'} after:text-gray-200 dark:after:text-gray-500`}
                >
                  {interfaceLocale === 'ar' ? (
                    <>
                      {translations.step1_title || (interfaceLocale === 'fr' ? 'Informations Personnelles' : 'المعلومات الشخصية')}
                      <span className={direction === 'rtl' ? 'ml-3' : 'mr-3'}>1</span>
                    </>
                  ) : (
                    <>
                      <span className={direction === 'rtl' ? 'ml-3' : 'mr-3'}>1</span>
                      {translations.step1_title || (interfaceLocale === 'fr' ? 'Informations Personnelles' : 'المعلومات الشخصية')}
                    </>
                  )}
                  {step > 1 ? (
                    <svg
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${direction === 'rtl' ? 'ml-3' : 'mr-3'}`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                  ) : null}
                </span>
              </li>
              <li
                className={`flex md:w-full items-center ${step === 2 || step > 2 ? 'text-blue-600 dark:text-blue-500' : ''} sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block ${direction === 'rtl' ? 'after:mr-8 xl:after:mr-12' : 'after:ml-8 xl:after:ml-12'} dark:after:border-gray-700`}
              >
                <span
                  className={`flex items-center after:content-['/'] sm:after:hidden ${direction === 'rtl' ? 'after:mr-3' : 'after:ml-3'} after:text-gray-200 dark:after:text-gray-500`}
                >
                  {interfaceLocale === 'ar' ? (
                    <>
                      {translations.step2_title || (interfaceLocale === 'fr' ? 'Informations Professionnelles' : 'المعلومات المهنية')}
                      <span className={direction === 'rtl' ? 'ml-3' : 'mr-3'}>2</span>
                    </>
                  ) : (
                    <>
                      <span className={direction === 'rtl' ? 'ml-3' : 'mr-3'}>2</span>
                      {translations.step2_title || (interfaceLocale === 'fr' ? 'Informations Professionnelles' : 'المعلومات المهنية')}
                    </>
                  )}
                  {step > 2 ? (
                    <svg
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${direction === 'rtl' ? 'ml-3' : 'mr-3'}`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                  ) : null}
                </span>
              </li>
              <li
                className={`${interfaceLocale === 'ar'
                  ? "flex md:w-full items-center sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mr-8 xl:after:mr-12 dark:after:border-gray-700"
                  : 'flex items-center'
                  } ${step === 3 ? 'text-blue-600 dark:text-blue-500' : ''}`}
              >
                <span
                  className={`flex items-center ${direction === 'rtl' ? 'after:mr-3' : 'after:ml-3'} after:content-['/'] sm:after:hidden after:text-gray-200 dark:after:text-gray-500`}
                >
                  {interfaceLocale === 'ar' ? (
                    <>
                      {translations.step3_title || (interfaceLocale === 'fr' ? 'Informations sur l\'oeuvre' : 'معلومات عن العمل')}
                      <span className={direction === 'rtl' ? 'ml-3' : 'mr-3'}>3</span>
                    </>
                  ) : (
                    <>
                      <span className={direction === 'rtl' ? 'ml-3' : 'mr-3'}>3</span>
                      {translations.step3_title || (interfaceLocale === 'fr' ? 'Informations sur l\'oeuvre' : 'معلومات عن العمل')}
                    </>
                  )}
                  {step > 3 ? (
                    <svg
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${direction === 'rtl' ? 'ml-3' : 'mr-3'}`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                  ) : null}
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
    const t = translations || {}; // Utiliser les traductions dynamiques
    console.log('MultiStepForm - interfaceLocale:', interfaceLocale, 't:', t);
    switch (step) {
      case 1:
        return (
          <Step1
            data={step1Data}
            onChange={handleStep1Change}
            onFileChange={handleFileChange}
            onNext={nextStep}
            error={error || wilayasError || translationError}
            wilayas={wilayas}
            isLoadingWilayas={isLoadingWilayas}
            interfaceLocale={interfaceLocale}
            t={t}
            direction={direction}
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
            error={error || translationError}
            setIsProfessionalCardValidated={setIsProfessionalCardValidated}
            interfaceLocale={interfaceLocale}
            t={t}
            direction={direction}
          />
        );
      case 3:
        return (
          <Step3
            data={formData}
            onChange={handleStep3Change}
            onFileChange={handleFileChange}
            onBack={prevStep}
            userId={formData.userId}
            themes={formData.themes}
            categories={formData.categories}
            interfaceLocale={interfaceLocale}
            t={t}
            direction={direction}
          />
        );
      default:
        return (
          <div className="text-center text-green-600 text-xl font-bold">
            {translations.form_completed || (interfaceLocale === 'fr' ? '✅ Formulaire terminé !' : '✅ اكتمل النموذج !')}
          </div>
        );
    }
  }
}