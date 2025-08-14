import React, { useEffect, useState, useCallback } from 'react';

const Step1 = ({ data, onChange, onFileChange, onNext, error, wilayas, isLoadingWilayas, langue, t }) => {
  const [ninError, setNinError] = useState('');
  const [ninExistsMessage, setNinExistsMessage] = useState('');
  const [isNinDisabled, setIsNinDisabled] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  // Mapper pour sexe
  const sexeMap = {
    frToAr: {
      'Masculin': 'ذكر',
      'Féminin': 'أنثى',
    },
    arToFr: {
      'ذكر': 'Masculin',
      'أنثى': 'Féminin',
    },
  };

  // Fonction pour formater la date ISO en yyyy-MM-dd
  const formatDateForInput = useCallback((isoDate) => {
    if (!isoDate) return '';
    return isoDate.split('T')[0];
  }, []);

  // Valider le NIN
  const validateNin = useCallback(
    async (value) => {
      if (!value) {
        setNinError(t.required.replace(':attribute', t.id_nin_personne));
        setNinExistsMessage('');
        return false;
      }
      if (value.length !== 18) {
        setNinError(t.nin_invalid);
        setNinExistsMessage('');
        return false;
      }
      if (!/^[0-9]{18}$/.test(value)) {
        setNinError(t.nin_invalid);
        setNinExistsMessage('');
        return false;
      }

      try {
        const response = await fetch(`http://localhost:8000/check-nin?nin=${value}`, {
          headers: { Accept: 'application/json' },
        });
        const result = await response.json();

        if (response.ok) {
          if (result.exists) {
            setNinExistsMessage(
              langue === 'fr'
                ? 'Ce numéro NIN existe déjà dans la base de données.'
                : 'رقم الهوية الوطنية موجود مسبقًا في قاعدة البيانات.'
            );
            setIsNinDisabled(true);
            if (result.data) {
              onChange({
                target: {
                  name: 'batch',
                  value: {
                    id_nin_personne: result.data.id_nin_personne || '',
                    nom_personne_fr: result.data.nom_personne_fr || '',
                    prenom_personne_fr: result.data.prenom_personne_fr || '',
                    nom_personne_ar: result.data.nom_personne_ar || '',
                    prenom_personne_ar: result.data.prenom_personne_ar || '',
                    date_naissance: formatDateForInput(result.data.date_naissance) || '',
                    lieu_naissance_fr: result.data.lieu_naissance_fr || '',
                    lieu_naissance_ar: result.data.lieu_naissance_ar || '',
                    nationalite_fr: result.data.nationalite_fr || 'Algerienne',
                    nationalite_ar: result.data.nationalite_ar || 'جزائرية',
                    num_tlf_personne: result.data.num_tlf_personne || '',
                    adresse_fr: result.data.adresse_fr || '',
                    adresse_ar: result.data.adresse_ar || '',
                    sexe_personne_fr: result.data.sexe_personne_fr || '',
                    sexe_personne_ar: result.data.sexe_personne_ar || '',
                    groupage: result.data.groupage || '',
                    id_professional_card: result.data.id_professional_card || '',
                    fonction_fr: result.data.fonction_fr || '',
                    fonction_ar: result.data.fonction_ar || '',
                    fichiers: result.data.fichiers || [],
                  },
                },
              });
            }
          } else {
            setNinExistsMessage('');
            setIsNinDisabled(false);
            onChange({
              target: {
                name: 'batch',
                value: {
                  id_nin_personne: value,
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
                },
              },
            });
          }
          setNinError('');
          return true;
        } else {
          setNinError(result.message || t.required.replace(':attribute', t.id_nin_personne));
          setNinExistsMessage('');
          return false;
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du NIN :', error);
        setNinError(t.required.replace(':attribute', t.id_nin_personne));
        setNinExistsMessage('');
        return false;
      }
    },
    [onChange, formatDateForInput, t, langue]
  );

  // Gérer le changement du NIN
  const handleNinChange = useCallback(
    async (e) => {
      const { value } = e.target;
      if (value === data.id_nin_personne) return;
      onChange(e);
      await validateNin(value);
    },
    [data.id_nin_personne, onChange, validateNin]
  );

  // Gérer les changements avec synchronisation
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updates = { [name]: value };

    // Synchroniser lieu_naissance
    if (name === 'lieu_naissance_fr') {
      const wilaya = wilayas.find((w) => w.name_fr === value);
      if (wilaya) updates.lieu_naissance_ar = wilaya.name_ar;
    } else if (name === 'lieu_naissance_ar') {
      const wilaya = wilayas.find((w) => w.name_ar === value);
      if (wilaya) updates.lieu_naissance_fr = wilaya.name_fr;
    }
    // Synchroniser sexe
    else if (name === 'sexe_personne_fr') {
      updates.sexe_personne_ar = sexeMap.frToAr[value] || value;
    } else if (name === 'sexe_personne_ar') {
      updates.sexe_personne_fr = sexeMap.arToFr[value] || value;
    }

    onChange({ target: { name: 'batch', value: updates } });
  };

  // Vérifier si le formulaire est complet
  const isFormComplete = useCallback(() => {
    const checks = {
      id_nin_personne:
        data.id_nin_personne &&
        data.id_nin_personne.length === 18 &&
        /^[0-9]{18}$/.test(data.id_nin_personne),
      nom_personne_fr: data.nom_personne_fr?.trim(),
      prenom_personne_fr: data.prenom_personne_fr?.trim(),
      nom_personne_ar: data.nom_personne_ar?.trim(),
      prenom_personne_ar: data.prenom_personne_ar?.trim(),
      date_naissance: !!data.date_naissance,
      lieu_naissance_fr: !!data.lieu_naissance_fr,
      lieu_naissance_ar: !!data.lieu_naissance_ar,
      nationalite_fr: !!data.nationalite_fr,
      nationalite_ar: !!data.nationalite_ar,
      num_tlf_personne: data.num_tlf_personne && /^[0-9]{10}$/.test(data.num_tlf_personne),
      adresse_fr: data.adresse_fr?.trim(),
      adresse_ar: data.adresse_ar?.trim(),
      sexe_personne_fr: !!data.sexe_personne_fr,
      sexe_personne_ar: !!data.sexe_personne_ar,
      groupage: !!data.groupage,
      carte_nationale:
        data.carte_nationale instanceof File ||
        (data.fichiers && data.fichiers.some((f) => f.type === 'carte_nationale')),
      photo:
        data.photo instanceof File || (data.fichiers && data.fichiers.some((f) => f.type === 'photo')),
      isLoadingWilayas: !isLoadingWilayas,
    };

    return Object.values(checks).every((value) => !!value) && !ninError;
  }, [data, isLoadingWilayas, ninError]);

  // Valider les erreurs lors de la soumission
  const validateFormErrors = useCallback(() => {
    const checks = {
      id_nin_personne:
        data.id_nin_personne &&
        data.id_nin_personne.length === 18 &&
        /^[0-9]{18}$/.test(data.id_nin_personne),
      nom_personne_fr: data.nom_personne_fr?.trim(),
      prenom_personne_fr: data.prenom_personne_fr?.trim(),
      nom_personne_ar: data.nom_personne_ar?.trim(),
      prenom_personne_ar: data.prenom_personne_ar?.trim(),
      date_naissance: !!data.date_naissance,
      lieu_naissance_fr: !!data.lieu_naissance_fr,
      lieu_naissance_ar: !!data.lieu_naissance_ar,
      nationalite_fr: !!data.nationalite_fr,
      nationalite_ar: !!data.nationalite_ar,
      num_tlf_personne: data.num_tlf_personne && /^[0-9]{10}$/.test(data.num_tlf_personne),
      adresse_fr: data.adresse_fr?.trim(),
      adresse_ar: data.adresse_ar?.trim(),
      sexe_personne_fr: !!data.sexe_personne_fr,
      sexe_personne_ar: !!data.sexe_personne_ar,
      groupage: !!data.groupage,
      carte_nationale:
        data.carte_nationale instanceof File ||
        (data.fichiers && data.fichiers.some((f) => f.type === 'carte_nationale')),
      photo:
        data.photo instanceof File || (data.fichiers && data.fichiers.some((f) => f.type === 'photo')),
      isLoadingWilayas: !isLoadingWilayas,
    };

    const errors = [];
    if (!checks.id_nin_personne) errors.push(t.nin_invalid);
    if (!checks.nom_personne_fr) errors.push(t.required.replace(':attribute', t.nom_personne_fr));
    if (!checks.prenom_personne_fr) errors.push(t.required.replace(':attribute', t.prenom_personne_fr));
    if (!checks.nom_personne_ar) errors.push(t.required.replace(':attribute', t.nom_personne_ar));
    if (!checks.prenom_personne_ar) errors.push(t.required.replace(':attribute', t.prenom_personne_ar));
    if (!checks.date_naissance) errors.push(t.required.replace(':attribute', t.date_naissance));
    if (!checks.lieu_naissance_fr) errors.push(t.required.replace(':attribute', t.lieu_naissance_fr));
    if (!checks.lieu_naissance_ar) errors.push(t.required.replace(':attribute', t.lieu_naissance_ar));
    if (!checks.nationalite_fr) errors.push(t.required.replace(':attribute', t.nationalite_fr));
    if (!checks.nationalite_ar) errors.push(t.required.replace(':attribute', t.nationalite_ar));
    if (!checks.num_tlf_personne) errors.push(t.phone_invalid);
    if (!checks.adresse_fr) errors.push(t.required.replace(':attribute', t.adresse_fr));
    if (!checks.adresse_ar) errors.push(t.required.replace(':attribute', t.adresse_ar));
    if (!checks.sexe_personne_fr) errors.push(t.required.replace(':attribute', t.sexe_personne_fr));
    if (!checks.sexe_personne_ar) errors.push(t.required.replace(':attribute', t.sexe_personne_ar));
    if (!checks.groupage) errors.push(t.required.replace(':attribute', t.groupage));
    if (!checks.carte_nationale)
      errors.push(t.required.replace(':attribute', t.carte_nationale));
    if (!checks.photo) errors.push(t.required.replace(':attribute', t.photo));
    if (!checks.isLoadingWilayas) errors.push(t.required.replace(':attribute', 'wilayas'));

    setFormErrors(errors);
    return errors.length === 0 && !ninError;
  }, [data, isLoadingWilayas, ninError, t]);

  // Débogage avec useEffect
  useEffect(() => {
    console.log('État de Step1 :', {
      id_nin_personne: data.id_nin_personne,
      id_nin_personne_length: data.id_nin_personne?.length,
      nom_personne_fr: data.nom_personne_fr,
      prenom_personne_fr: data.prenom_personne_fr,
      nom_personne_ar: data.nom_personne_ar,
      prenom_personne_ar: data.prenom_personne_ar,
      date_naissance: data.date_naissance,
      lieu_naissance_fr: data.lieu_naissance_fr,
      lieu_naissance_ar: data.lieu_naissance_ar,
      nationalite_fr: data.nationalite_fr,
      nationalite_ar: data.nationalite_ar,
      num_tlf_personne: data.num_tlf_personne,
      adresse_fr: data.adresse_fr,
      adresse_ar: data.adresse_ar,
      sexe_personne_fr: data.sexe_personne_fr,
      sexe_personne_ar: data.sexe_personne_ar,
      groupage: data.groupage,
      carte_nationale: data.carte_nationale ? `${data.carte_nationale.name} (${data.carte_nationale.size} bytes)` : null,
      photo: data.photo ? `${data.photo.name} (${data.photo.size} bytes)` : null,
      fichiers: data.fichiers,
      isLoadingWilayas: isLoadingWilayas,
      wilayas_length: wilayas.length,
    });
  }, [data, isLoadingWilayas, wilayas]);

  // Gérer la soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const ninValid = await validateNin(data.id_nin_personne);
    if (!ninValid) return;
    if (!validateFormErrors()) {
      console.error('Formulaire incomplet, vérifiez les champs.');
      return;
    }
    onNext();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-6 w-full max-w-5xl bg-white shadow-md rounded-lg p-8 ${langue === 'ar' ? 'text-right' : ''}`}
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      {ninExistsMessage && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          {ninExistsMessage}
        </div>
      )}
      {formErrors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <ul>
            {formErrors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </div>
      )}
      {isLoadingWilayas && (
        <div className="text-center text-gray-600">
          {langue === 'fr' ? 'Chargement des wilayas...' : 'جارٍ تحميل الولايات...'}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">{t.id_nin_personne}</label>
          <input
            type="text"
            name="id_nin_personne"
            value={data.id_nin_personne || ''}
            onChange={handleNinChange}
            maxLength={18}
            disabled={isNinDisabled}
            className={`bg-gray-50 border ${
              ninError ? 'border-red-500' : 'border-gray-300'
            } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
              isNinDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
            } ${langue === 'ar' ? 'text-right' : ''}`}
            placeholder={t.id_nin_personne}
            required
          />
          {ninError && <p className="mt-1 text-sm text-red-600">{ninError}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">{t.num_tlf_personne}</label>
          <input
            name="num_tlf_personne"
            value={data.num_tlf_personne || ''}
            onChange={onChange}
            pattern="[0-9]{10}"
            title={t.phone_invalid}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
              langue === 'ar' ? 'text-right' : ''
            }`}
            placeholder={t.num_tlf_personne}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">{t.nom_personne_fr}</label>
          <input
            name="nom_personne_fr"
            value={data.nom_personne_fr || ''}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder={t.nom_personne_fr}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">{t.prenom_personne_fr}</label>
          <input
            name="prenom_personne_fr"
            value={data.prenom_personne_fr || ''}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder={t.prenom_personne_fr}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">{t.nom_personne_ar}</label>
          <input
            name="nom_personne_ar"
            value={data.nom_personne_ar || ''}
            onChange={onChange}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
              langue === 'ar' ? 'text-right' : ''
            }`}
            placeholder={t.nom_personne_ar}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">{t.prenom_personne_ar}</label>
          <input
            name="prenom_personne_ar"
            value={data.prenom_personne_ar || ''}
            onChange={onChange}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
              langue === 'ar' ? 'text-right' : ''
            }`}
            placeholder={t.prenom_personne_ar}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">{t.date_naissance}</label>
          <input
            type="date"
            name="date_naissance"
            value={data.date_naissance || ''}
            onChange={onChange}
            max={new Date().toISOString().split('T')[0]}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">{t.groupage}</label>
          <select
            name="groupage"
            value={data.groupage || ''}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          >
            <option value="" disabled>
              {langue === 'fr' ? 'Sélectionnez un groupe sanguin' : 'اختر فصيلة الدم'}
            </option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        {langue === 'fr' && (
          <>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">{t.lieu_naissance_fr}</label>
              <select
                name="lieu_naissance_fr"
                value={data.lieu_naissance_fr || ''}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                disabled={isLoadingWilayas || wilayas.length === 0}
                required
              >
                <option value="" disabled>
                  {langue === 'fr' ? 'Sélectionnez une wilaya' : 'اختر ولاية'}
                </option>
                {wilayas.map((wilaya) => (
                  <option key={wilaya.id} value={wilaya.name_fr}>
                    {wilaya.name_fr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">{t.sexe_personne_fr}</label>
              <select
                name="sexe_personne_fr"
                value={data.sexe_personne_fr || ''}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              >
                <option value="" disabled>
                  {langue === 'fr' ? 'Sélectionnez le sexe' : 'اختر الجنس'}
                </option>
                <option value="Masculin">Masculin</option>
                <option value="Féminin">Féminin</option>
              </select>
            </div>
          </>
        )}

        {langue === 'ar' && (
          <>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">{t.lieu_naissance_ar}</label>
              <select
                name="lieu_naissance_ar"
                value={data.lieu_naissance_ar || ''}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-right"
                disabled={isLoadingWilayas || wilayas.length === 0}
                required
              >
                <option value="" disabled>
                  {langue === 'fr' ? 'Sélectionnez une wilaya' : 'اختر ولاية'}
                </option>
                {wilayas.map((wilaya) => (
                  <option key={wilaya.id} value={wilaya.name_ar}>
                    {wilaya.name_ar}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">{t.sexe_personne_ar}</label>
              <select
                name="sexe_personne_ar"
                value={data.sexe_personne_ar || ''}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-right"
                required
              >
                <option value="" disabled>
                  {langue === 'fr' ? 'Sélectionnez le sexe' : 'اختر الجنس'}
                </option>
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">{t.nationalite_fr}</label>
          <input
            name="nationalite_fr"
            value={data.nationalite_fr || 'Algerienne'}
            disabled
            className="bg-gray-100 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed"
            placeholder={t.nationalite_fr}
          />
          <input type="hidden" name="nationalite_fr" value={data.nationalite_fr || 'Algerienne'} />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">{t.nationalite_ar}</label>
          <input
            name="nationalite_ar"
            value={data.nationalite_ar || 'جزائرية'}
            disabled
            className={`bg-gray-100 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed ${
              langue === 'ar' ? 'text-right' : ''
            }`}
            placeholder={t.nationalite_ar}
          />
          <input type="hidden" name="nationalite_ar" value={data.nationalite_ar || 'جزائرية'} />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">{t.adresse_fr}</label>
          <input
            name="adresse_fr"
            value={data.adresse_fr || ''}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder={t.adresse_fr}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">{t.adresse_ar}</label>
          <input
            name="adresse_ar"
            value={data.adresse_ar || ''}
            onChange={onChange}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
              langue === 'ar' ? 'text-right' : ''
            }`}
            placeholder={t.adresse_ar}
            required
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="carte_nationale">
          {t.carte_nationale}
        </label>
        {data.fichiers && data.fichiers.some((f) => f.type === 'carte_nationale') && (
          <div className="mb-2">
            <p className="text-sm text-gray-600">
              {langue === 'fr' ? 'Fichier existant :' : 'الملف الموجود :'}
              {data.fichiers.find((f) => f.type === 'carte_nationale').nom_fichier_fr}{' '}
              <a
                href={`http://localhost:8000/storage/${data.fichiers.find((f) => f.type === 'carte_nationale').file_path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {langue === 'fr' ? '(Voir)' : '(عرض)'}
              </a>
            </p>
          </div>
        )}
        <input
          type="file"
          name="carte_nationale"
          onChange={onFileChange}
          accept="application/pdf"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required={!data.fichiers || !data.fichiers.some((f) => f.type === 'carte_nationale')}
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">{t.photo}</label>
        {data.fichiers && data.fichiers.some((f) => f.type === 'photo') && (
          <div className="mb-2">
            <p className="text-sm text-gray-600">
              {langue === 'fr' ? 'Fichier existant :' : 'الملف الموجود :'}
              {data.fichiers.find((f) => f.type === 'photo').nom_fichier_fr}{' '}
              <a
                href={`http://localhost:8000/storage/${data.fichiers.find((f) => f.type === 'photo').file_path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {langue === 'fr' ? '(Voir)' : '(عرض)'}
              </a>
            </p>
          </div>
        )}
        <input
          type="file"
          name="photo"
          onChange={onFileChange}
          accept="image/jpeg,image/png,image/jpg"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required={!data.fichiers || !data.fichiers.some((f) => f.type === 'photo')}
        />
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isFormComplete()}
        >
          {t.next_step}
        </button>
      </div>
    </form>
  );
};

export default Step1;