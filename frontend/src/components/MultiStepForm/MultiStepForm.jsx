import React, { useState, useEffect } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

export default function MultiStepForm({ locale, setLocale }) {
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

  // Définir les traductions
  const translations = {
    fr: {
      id_nin_personne: 'Numéro NIN',
      nom_personne_fr: 'Nom (FR)',
      prenom_personne_fr: 'Prénom (FR)',
      nom_personne_ar: 'Nom (AR)',
      prenom_personne_ar: 'Prénom (AR)',
      date_naissance: 'Date de naissance',
      lieu_naissance_fr: 'Lieu de naissance (FR)',
      lieu_naissance_ar: 'Lieu de naissance (AR)',
      sexe_personne_fr: 'Sexe (FR)',
      sexe_personne_ar: 'Sexe (AR)',
      nationalite_fr: 'Nationalité (FR)',
      nationalite_ar: 'Nationalité (AR)',
      num_tlf_personne: 'Téléphone',
      adresse_fr: 'Adresse (FR)',
      adresse_ar: 'Adresse (AR)',
      groupage: 'Groupe sanguin',
      carte_nationale: 'Carte nationale',
      photo: 'Photo',
      required: 'Le champ :attribute est requis.',
      nin_invalid: 'Le numéro NIN doit contenir 18 chiffres.',
      phone_invalid: 'Le numéro de téléphone doit contenir 10 chiffres.',
      next_step: 'Étape suivante →',
      id_professional_card: 'Carte professionnelle',
      num_attes: 'Réf Attestation de travail',
      fonction_fr: 'Fonction (FR)',
      fonction_ar: 'Fonction (AR)',
      secteur_travail: 'Secteur de travail',
      categorie: 'Catégorie',
      type_media: 'Type Média',
      tv: 'TV',
      radio: 'Radio',
      media: 'Type',
      langue: 'Langue',
      specialite: 'Spécialité',
      nom_etablissement: 'Nom établissement (FR)',
      nom_etablissement_ar: 'Nom établissement (AR)',
      email: 'Email établissement',
      tel: 'Téléphone établissement',
      attestation_travail: 'Attestation de travail',
      back: 'Retour',
      card_exists: 'Carte professionnelle trouvée. Vous pouvez modifier les données.',
      new_card: 'Nouvelle carte professionnelle. Veuillez remplir les informations.',
      card_already_used: 'Cette carte professionnelle appartient déjà à une autre personne.',
      card_verification_error: 'Erreur lors de la vérification de la carte professionnelle.',
      category_required_public: 'La catégorie est requise pour le secteur public.',
      type_media_required_audio: 'Le type de média est requis pour la catégorie Média audio.',
      category_private: 'La catégorie doit être "Privé" pour le secteur privé.',
      type_media_private: 'Le type de média doit être "Privé" pour le secteur privé.',
      email_invalid: "L'email est invalide ou requis.",
      existing_file: 'Fichier existant :',
      view_file: '(Voir)',
      specialites: {
        Culturel: 'Culturel',
        Economique: 'Economique',
        Publique: 'Publique',
        Sport: 'Sport',
        Santé: 'Santé',
        Touristique: 'Touristique',
        Agricole: 'Agricole',
        Technologique: 'Technologique',
        Automobile: 'Automobile',
      },
    },
    ar: {
      id_nin_personne: 'رقم الهوية الوطنية',
      nom_personne_fr: 'الاسم (فرنسي)',
      prenom_personne_fr: 'اللقب (فرنسي)',
      nom_personne_ar: 'الاسم (عربي)',
      prenom_personne_ar: 'اللقب (عربي)',
      date_naissance: 'تاريخ الميلاد',
      lieu_naissance_ar: 'مكان الولادة (عربي)',
      sexe_personne_ar: 'الجنس (عربي)',
      nationalite_fr: 'الجنسية (فرنسي)',
      nationalite_ar: 'الجنسية (عربي)',
      num_tlf_personne: 'الهاتف',
      adresse_fr: 'العنوان (فرنسي)',
      adresse_ar: 'العنوان (عربي)',
      groupage: 'فصيلة الدم',
      carte_nationale: 'البطاقة الوطنية',
      photo: 'الصورة',
      required: 'الحقل :attribute مطلوب.',
      nin_invalid: 'رقم الهوية الوطنية يجب أن يحتوي على 18 رقمًا.',
      phone_invalid: 'رقم الهاتف يجب أن يحتوي على 10 أرقام.',
      next_step: 'الخطوة التالية ←',
      id_professional_card: 'رقم البطاقة المهنية',
      num_attes: 'رقم شهادة العمل',
      fonction_fr: 'الوظيفة (فرنسي)',
      fonction_ar: 'الوظيفة (عربي)',
      secteur_travail: 'قطاع العمل',
      categorie: 'الفئة',
      type_media: 'نوع الوسائط',
      tv: 'تلفزيون',
      radio: 'راديو',
      media: 'النوع',
      langue: 'اللغة',
      specialite: 'التخصص',
      nom_etablissement: 'اسم المؤسسة (فرنسي)',
      nom_etablissement_ar: 'اسم المؤسسة (عربي)',
      email: 'البريد الإلكتروني للمؤسسة',
      tel: 'هاتف المؤسسة',
      attestation_travail: 'شهادة العمل',
      back: 'رجوع',
      card_exists: 'تم العثور على البطاقة المهنية. يمكنك تعديل البيانات.',
      new_card: 'بطاقة مهنية جديدة. يرجى ملء المعلومات.',
      card_already_used: 'هذه البطاقة المهنية تخص شخصًا آخر.',
      card_verification_error: 'خطأ أثناء التحقق من البطاقة المهنية.',
      category_required_public: 'الفئة مطلوبة للقطاع العام.',
      type_media_required_audio: 'نوع الوسائط مطلوب لفئة الوسائط الصوتية.',
      category_private: 'يجب أن تكون الفئة "خاص" للقطاع الخاص.',
      type_media_private: 'يجب أن يكون نوع الوسائط "خاص" للقطاع الخاص.',
      email_invalid: 'البريد الإلكتروني غير صالح أو مطلوب.',
      existing_file: 'الملف الموجود:',
      view_file: '(عرض)',
      specialites: {
        Culturel: 'ثقافي',
        Economique: 'اقتصادي',
        Publique: 'عام',
        Sport: 'رياضي',
        Santé: 'صحي',
        Touristique: 'سياحي',
        Agricole: 'زراعي',
        Technologique: 'تكنولوجي',
        Automobile: 'سيارات',
      },
    },
  };

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
        setError(translations[locale].required.replace(':attribute', translations[locale].required));
      }
    };
    checkAuth();
  }, [locale]);

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
        setError(translations[locale].required.replace(':attribute', translations[locale].required));
      }
    };
    fetchFormData();
  }, [locale]);

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
        setWilayasError(translations[locale].required.replace(':attribute', translations[locale].required));
        setIsLoadingWilayas(false);
      }
    };
    fetchWilayas();
  }, [locale]);

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
    if (files[0]) {
      if (name === 'carte_nationale' && files[0].size > 10 * 1024 * 1024) {
        setError(translations[locale].required.replace(':attribute', translations[locale].carte_nationale + ' (taille max 10 Mo)'));
        return;
      }
      if (name === 'photo' && files[0].size > 5 * 1024 * 1024) {
        setError(translations[locale].required.replace(':attribute', translations[locale].photo + ' (taille max 5 Mo)'));
        return;
      }
      if (name === 'attestation_travail' && files[0].size > 10 * 1024 * 1024) {
        setError(translations[locale].required.replace(':attribute', translations[locale].attestation_travail + ' (taille max 10 Mo)'));
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
      setError(translations[locale].required.replace(':attribute', translations[locale].id_nin_personne));
      return false;
    }
    if (step1Data.id_nin_personne.length !== 18 || !/^[0-9]{18}$/.test(step1Data.id_nin_personne)) {
      setError(translations[locale].nin_invalid);
      return false;
    }
    if (!step1Data.nom_personne_fr) {
      setError(translations[locale].required.replace(':attribute', translations[locale].nom_personne_fr));
      return false;
    }
    if (!step1Data.prenom_personne_fr) {
      setError(translations[locale].required.replace(':attribute', translations[locale].prenom_personne_fr));
      return false;
    }
    if (!step1Data.nom_personne_ar) {
      setError(translations[locale].required.replace(':attribute', translations[locale].nom_personne_ar));
      return false;
    }
    if (!step1Data.prenom_personne_ar) {
      setError(translations[locale].required.replace(':attribute', translations[locale].prenom_personne_ar));
      return false;
    }
    if (!step1Data.date_naissance) {
      setError(translations[locale].required.replace(':attribute', translations[locale].date_naissance));
      return false;
    }
    if (!step1Data.lieu_naissance_fr) {
      setError(translations[locale].required.replace(':attribute', translations[locale].lieu_naissance_fr));
      return false;
    }
    if (!step1Data.lieu_naissance_ar) {
      setError(translations[locale].required.replace(':attribute', translations[locale].lieu_naissance_ar));
      return false;
    }
    if (!step1Data.nationalite_fr) {
      setError(translations[locale].required.replace(':attribute', translations[locale].nationalite_fr));
      return false;
    }
    if (!step1Data.nationalite_ar) {
      setError(translations[locale].required.replace(':attribute', translations[locale].nationalite_ar));
      return false;
    }
    if (!step1Data.num_tlf_personne || !/^[0-9]{10}$/.test(step1Data.num_tlf_personne)) {
      setError(translations[locale].phone_invalid);
      return false;
    }
    if (!step1Data.adresse_fr) {
      setError(translations[locale].required.replace(':attribute', translations[locale].adresse_fr));
      return false;
    }
    if (!step1Data.adresse_ar) {
      setError(translations[locale].required.replace(':attribute', translations[locale].adresse_ar));
      return false;
    }
    if (!step1Data.sexe_personne_fr) {
      setError(translations[locale].required.replace(':attribute', translations[locale].sexe_personne_fr));
      return false;
    }
    if (!step1Data.sexe_personne_ar) {
      setError(translations[locale].required.replace(':attribute', translations[locale].sexe_personne_ar));
      return false;
    }
    if (!step1Data.groupage) {
      setError(translations[locale].required.replace(':attribute', translations[locale].groupage));
      return false;
    }
    if (!step1Data.carte_nationale && (!step1Data.fichiers || !step1Data.fichiers.some((f) => f.type === 'carte_nationale'))) {
      setError(translations[locale].required.replace(':attribute', translations[locale].carte_nationale));
      return false;
    }
    if (!step1Data.photo && (!step1Data.fichiers || !step1Data.fichiers.some((f) => f.type === 'photo'))) {
      setError(translations[locale].required.replace(':attribute', translations[locale].photo));
      return false;
    }
    return true;
  };

  const validateStep2 = async () => {
    const errors = {};
    if (!formData.id_professional_card) {
      errors.id_professional_card = translations[locale].required.replace(':attribute', translations[locale].id_professional_card);
    }
    if (!formData.num_attes) {
      errors.num_attes = translations[locale].required.replace(':attribute', translations[locale].num_attes);
    }
    if (!formData.fonction_fr) {
      errors.fonction_fr = translations[locale].required.replace(':attribute', translations[locale].fonction_fr);
    }
    if (!formData.fonction_ar) {
      errors.fonction_ar = translations[locale].required.replace(':attribute', translations[locale].fonction_ar);
    }
    if (!formData.secteur_travail) {
      errors.secteur_travail = translations[locale].required.replace(':attribute', translations[locale].secteur_travail);
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = translations[locale].email_invalid;
    }
    if (!formData.tel || !/^(\+?\d{8,15})$/.test(formData.tel)) {
      errors.tel = translations[locale].phone_invalid;
    }
    if (!formData.attestation_travail && (!formData.fichiers || !formData.fichiers.some((f) => f.type === 'attestation_travail'))) {
      errors.attestation_travail = translations[locale].required.replace(':attribute', translations[locale].attestation_travail);
    }
    if (!formData.nom_etablissement) {
      errors.nom_etablissement = translations[locale].required.replace(':attribute', translations[locale].nom_etablissement);
    }
    if (!formData.nom_etablissement_ar) {
      errors.nom_etablissement_ar = translations[locale].required.replace(':attribute', translations[locale].nom_etablissement_ar);
    }
    if (formData.secteur_travail === 'Public') {
      if (!formData.categorie || formData.categorie === 'unknown' || !['Média audio', 'Média écrit et électronique'].includes(formData.categorie)) {
        errors.categorie = translations[locale].category_required_public;
      }
      if (formData.categorie === 'Média audio' && (!formData.type_media || !['TV', 'Radio'].includes(formData.type_media))) {
        errors.type_media = translations[locale].type_media_required_audio;
      }
      if (formData.type_media === 'TV' && (!formData.tv || !['Régionale', 'Nationale'].includes(formData.tv))) {
        errors.tv = translations[locale].required.replace(':attribute', translations[locale].tv);
      }
      if (formData.type_media === 'Radio' && (!formData.radio || !['Publique', 'Locale'].includes(formData.radio))) {
        errors.radio = translations[locale].required.replace(':attribute', translations[locale].radio);
      }
      if (formData.categorie === 'Média écrit et électronique' && (!formData.media || !['Écrit', 'Électronique'].includes(formData.media))) {
        errors.media = translations[locale].required.replace(':attribute', translations[locale].media);
      }
      if ((formData.type_media === 'TV' || formData.categorie === 'Média écrit et électronique') && (!formData.specialite || !['Culturel', 'Economique', 'Publique', 'Sport', 'Santé', 'Touristique', 'Agricole', 'Technologique', 'Automobile'].includes(formData.specialite))) {
        errors.specialite = translations[locale].required.replace(':attribute', translations[locale].specialite);
      }
    }
    if (formData.secteur_travail === 'Privé') {
      if (formData.categorie !== 'Privé') {
        errors.categorie = translations[locale].category_private;
      }
      if (formData.type_media !== 'Privé') {
        errors.type_media = translations[locale].type_media_private;
      }
      if (!formData.langue || !['Arabe', 'Français'].includes(formData.langue)) {
        errors.langue = translations[locale].required.replace(':attribute', translations[locale].langue);
      }
      if (!formData.specialite || !['Culturel', 'Economique', 'Publique', 'Sport', 'Santé', 'Touristique', 'Agricole', 'Technologique', 'Automobile'].includes(formData.specialite)) {
        errors.specialite = translations[locale].required.replace(':attribute', translations[locale].specialite);
      }
    }
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors)[0]);
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
      form.append('locale', locale);
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
        setError(error.message || translations[locale].required.replace(':attribute', translations[locale].required));
      }
    } else if (step === 2) {
      if (!await validateStep2()) return;
      const form = new FormData();
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '' && key !== 'fichiers') {
          form.append(key, formData[key]);
        }
      }
      form.append('locale', locale);
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
        setError(error.message || translations[locale].required.replace(':attribute', translations[locale].required));
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
                className={`flex md:w-full items-center ${
                  step === 1 || step > 1 ? 'text-blue-600 dark:text-blue-500' : ''
                } sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}
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
                  {translations[locale].personal_info || (locale === 'fr' ? 'Informations Personnelles' : 'المعلومات الشخصية')}
                </span>
              </li>
              <li
                className={`flex md:w-full items-center ${
                  step === 2 || step > 2 ? 'text-blue-600 dark:text-blue-500' : ''
                } sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}
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
                  {translations[locale].account_info || (locale === 'fr' ? 'Compte Info' : 'معلومات الحساب')}
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
                  {translations[locale].confirmation || (locale === 'fr' ? 'Confirmation' : 'التأكيد')}
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
            locale={locale}
            t={translations[locale]}
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
            locale={locale}
            t={translations[locale]}
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
            locale={locale}
            t={translations[locale]}
          />
        );
      default:
        return (
          <div className="text-center text-green-600 text-xl font-bold">
            {translations[locale].form_completed || (locale === 'fr' ? '✅ Formulaire terminé !' : '✅ اكتمل النموذج !')}
          </div>
        );
    }
  }
}