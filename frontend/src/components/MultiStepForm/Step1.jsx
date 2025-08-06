import React, { useEffect, useState, useCallback } from 'react';

const Step1 = ({ data, onChange, onFileChange, onNext, error, wilayas, isLoadingWilayas }) => {
  const [ninError, setNinError] = useState('');
  const [ninExistsMessage, setNinExistsMessage] = useState('');
  const [isNinDisabled, setIsNinDisabled] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  // Fonction pour formater la date ISO en yyyy-MM-dd
  const formatDateForInput = useCallback((isoDate) => {
    if (!isoDate) return '';
    return isoDate.split('T')[0];
  }, []);

  // Valider le NIN
  const validateNin = useCallback(async (value) => {
    if (!value) {
      setNinError('Le numéro NIN est requis.');
      setNinExistsMessage('');
      return false;
    }
    if (value.length !== 18) {
      setNinError('Le numéro NIN doit contenir exactement 18 chiffres.');
      setNinExistsMessage('');
      return false;
    }
    if (!/^[0-9]{18}$/.test(value)) {
      setNinError('Le numéro NIN doit être composé uniquement de chiffres.');
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
          setNinExistsMessage('Ce numéro NIN existe déjà dans la base de données.');
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
          // Réinitialiser les champs si le NIN n'existe pas
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
        setNinError(result.message || 'Erreur lors de la vérification du NIN.');
        setNinExistsMessage('');
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du NIN :', error);
      setNinError('Erreur lors de la vérification du NIN.');
      setNinExistsMessage('');
      return false;
    }
  }, [onChange, formatDateForInput]);

  // Gérer le changement du NIN
  const handleNinChange = useCallback(
    async (e) => {
      const { value } = e.target;
      if (value === data.id_nin_personne) return; // Éviter les appels inutiles
      onChange(e);
      await validateNin(value);
    },
    [data.id_nin_personne, onChange, validateNin]
  );

  // Vérifier si le formulaire est complet
  const isFormComplete = useCallback(() => {
    const checks = {
      id_nin_personne: data.id_nin_personne && data.id_nin_personne.length === 18 && /^[0-9]{18}$/.test(data.id_nin_personne),
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
      carte_nationale: data.carte_nationale instanceof File || (data.fichiers && data.fichiers.some(f => f.type === 'carte_nationale')),
      photo: data.photo instanceof File || (data.fichiers && data.fichiers.some(f => f.type === 'photo')),
      isLoadingWilayas: !isLoadingWilayas,
    };

    return Object.values(checks).every(value => !!value) && !ninError;
  }, [data, isLoadingWilayas, ninError]);

  // Valider les erreurs uniquement lors de la soumission
  const validateFormErrors = useCallback(() => {
    const checks = {
      id_nin_personne: data.id_nin_personne && data.id_nin_personne.length === 18 && /^[0-9]{18}$/.test(data.id_nin_personne),
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
      carte_nationale: data.carte_nationale instanceof File || (data.fichiers && data.fichiers.some(f => f.type === 'carte_nationale')),
      photo: data.photo instanceof File || (data.fichiers && data.fichiers.some(f => f.type === 'photo')),
      isLoadingWilayas: !isLoadingWilayas,
    };

    const errors = [];
    if (!checks.id_nin_personne) errors.push('Le numéro NIN est invalide.');
    if (!checks.nom_personne_fr) errors.push('Le nom (FR) est requis.');
    if (!checks.prenom_personne_fr) errors.push('Le prénom (FR) est requis.');
    if (!checks.nom_personne_ar) errors.push('Le nom (AR) est requis.');
    if (!checks.prenom_personne_ar) errors.push('Le prénom (AR) est requis.');
    if (!checks.date_naissance) errors.push('La date de naissance est requise.');
    if (!checks.lieu_naissance_fr) errors.push('Le lieu de naissance (FR) est requis.');
    if (!checks.lieu_naissance_ar) errors.push('Le lieu de naissance (AR) est requis.');
    if (!checks.nationalite_fr) errors.push('La nationalité (FR) est requise.');
    if (!checks.nationalite_ar) errors.push('La nationalité (AR) est requise.');
    if (!checks.num_tlf_personne) errors.push('Le numéro de téléphone est invalide.');
    if (!checks.adresse_fr) errors.push('L\'adresse (FR) est requise.');
    if (!checks.adresse_ar) errors.push('L\'adresse (AR) est requise.');
    if (!checks.sexe_personne_fr) errors.push('Le sexe (FR) est requis.');
    if (!checks.sexe_personne_ar) errors.push('Le sexe (AR) est requis.');
    if (!checks.groupage) errors.push('Le groupe sanguin est requis.');
    if (!checks.carte_nationale) errors.push('La carte nationale est requise (téléchargez un fichier ou utilisez un fichier existant).');
    if (!checks.photo) errors.push('La photo est requise (téléchargez un fichier ou utilisez un fichier existant).');
    if (!checks.isLoadingWilayas) errors.push('Les wilayas sont en cours de chargement.');

    setFormErrors(errors);
    return errors.length === 0 && !ninError;
  }, [data, isLoadingWilayas, ninError]);

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
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-5xl bg-white shadow-md rounded-lg p-8">
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
        <div className="text-center text-gray-600">Chargement des wilayas...</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Numéro NIN</label>
          <input
            type="text"
            name="id_nin_personne"
            value={data.id_nin_personne || ''}
            onChange={handleNinChange}
            maxLength={18}
            disabled={isNinDisabled}
            className={`bg-gray-50 border ${ninError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${isNinDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="18 chiffres"
            required
          />
          {ninError && (
            <p className="mt-1 text-sm text-red-600">{ninError}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Téléphone</label>
          <input
            name="num_tlf_personne"
            value={data.num_tlf_personne || ''}
            onChange={onChange}
            pattern="[0-9]{10}"
            title="Le numéro de téléphone doit contenir exactement 10 chiffres."
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Téléphone (10 chiffres)"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Nom (FR)</label>
          <input
            name="nom_personne_fr"
            value={data.nom_personne_fr || ''}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Nom"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Prénom (FR)</label>
          <input
            name="prenom_personne_fr"
            value={data.prenom_personne_fr || ''}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Prénom"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Nom (AR)</label>
          <input
            name="nom_personne_ar"
            value={data.nom_personne_ar || ''}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-right"
            placeholder="الاسم"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Prénom (AR)</label>
          <input
            name="prenom_personne_ar"
            value={data.prenom_personne_ar || ''}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-right"
            placeholder="اللقب"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Date de naissance</label>
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
          <label className="block mb-2 text-sm font-medium text-gray-900">Groupe sanguin</label>
          <select
            name="groupage"
            value={data.groupage || ''}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          >
            <option value="" disabled>Sélectionnez un groupe sanguin</option>
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

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Lieu de naissance (FR)</label>
          <select
            name="lieu_naissance_fr"
            value={data.lieu_naissance_fr || ''}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            disabled={isLoadingWilayas || wilayas.length === 0}
            required
          >
            <option value="" disabled>Sélectionnez une wilaya</option>
            {wilayas.map(wilaya => (
              <option key={wilaya.id} value={wilaya.name_fr}>
                {wilaya.name_fr}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Lieu de naissance (AR)</label>
          <select
            name="lieu_naissance_ar"
            value={data.lieu_naissance_ar || ''}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-right"
            disabled={isLoadingWilayas || wilayas.length === 0}
            required
          >
            <option value="" disabled>اختر ولاية</option>
            {wilayas.map(wilaya => (
              <option key={wilaya.id} value={wilaya.name_ar}>
                {wilaya.name_ar}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Nationalité (FR)</label>
          <input
            name="nationalite_fr"
            value={data.nationalite_fr || 'Algerienne'}
            disabled
            className="bg-gray-100 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed"
            placeholder="Nationalité (FR)"
          />
          <input
            type="hidden"
            name="nationalite_fr"
            value={data.nationalite_fr || 'Algerienne'}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Nationalité (AR)</label>
          <input
            name="nationalite_ar"
            value={data.nationalite_ar || 'جزائرية'}
            disabled
            className="bg-gray-100 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed text-right"
            placeholder="الجنسية"
          />
          <input
            type="hidden"
            name="nationalite_ar"
            value={data.nationalite_ar || 'جزائرية'}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Adresse (FR)</label>
          <input
            name="adresse_fr"
            value={data.adresse_fr || ''}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Adresse (FR)"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Adresse (AR)</label>
          <input
            name="adresse_ar"
            value={data.adresse_ar || ''}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-right"
            placeholder="العنوان"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Sexe (FR)</label>
          <select
            name="sexe_personne_fr"
            value={data.sexe_personne_fr || ''}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          >
            <option value="" disabled>Sélectionnez le sexe</option>
            <option value="Masculin">Masculin</option>
            <option value="Féminin">Féminin</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Sexe (AR)</label>
          <select
            name="sexe_personne_ar"
            value={data.sexe_personne_ar || ''}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-right"
            required
          >
            <option value="" disabled>اختر الجنس</option>
            <option value="ذكر">ذكر</option>
            <option value="أنثى">أنثى</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="carte_nationale">
          Carte nationale
        </label>
        {data.fichiers && data.fichiers.some(f => f.type === 'carte_nationale') && (
          <div className="mb-2">
            <p className="text-sm text-gray-600">
              Fichier existant :{' '}
              {data.fichiers.find(f => f.type === 'carte_nationale').nom_fichier_fr}{' '}
              <a
                href={`http://localhost:8000/storage/${data.fichiers.find(f => f.type === 'carte_nationale').file_path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                (Voir)
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
          required={!data.fichiers || !data.fichiers.some(f => f.type === 'carte_nationale')}
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">Photo</label>
        {data.fichiers && data.fichiers.some(f => f.type === 'photo') && (
          <div className="mb-2">
            <p className="text-sm text-gray-600">
              Fichier existant :{' '}
              {data.fichiers.find(f => f.type === 'photo').nom_fichier_fr}{' '}
              <a
                href={`http://localhost:8000/storage/${data.fichiers.find(f => f.type === 'photo').file_path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                (Voir)
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
          required={!data.fichiers || !data.fichiers.some(f => f.type === 'photo')}
        />
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isFormComplete()}
        >
          Étape suivante →
        </button>
      </div>
    </form>
  );
};

export default Step1;