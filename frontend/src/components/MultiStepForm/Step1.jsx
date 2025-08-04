import React, { useEffect, useState } from 'react';

const Step1 = ({ data, onChange, onFileChange, onNext, error, wilayas, isLoadingWilayas }) => {
  const [ninError, setNinError] = useState('');

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
      isLoadingWilayas: isLoadingWilayas,
      wilayas_length: wilayas.length,
    });
  }, [data, isLoadingWilayas, wilayas]);

  const validateNin = (value) => {
    if (!value) {
      setNinError('Le numéro NIN est requis.');
      return false;
    }
    if (value.length !== 18) {
      setNinError('Le numéro NIN doit contenir exactement 18 chiffres.');
      return false;
    }
    if (!/^[0-9]{18}$/.test(value)) {
      setNinError('Le numéro NIN doit être composé uniquement de chiffres.');
      return false;
    }
    setNinError('');
    return true;
  };

  const handleNinChange = (e) => {
    const { value } = e.target;
    onChange(e);
    validateNin(value);
  };

  const isFormComplete = () => {
    const checks = {
      id_nin_personne: data.id_nin_personne && data.id_nin_personne.length === 18 && /^[0-9]{18}$/.test(data.id_nin_personne),
      nom_personne_fr: !!data.nom_personne_fr && data.nom_personne_fr.trim().length > 0,
      prenom_personne_fr: !!data.prenom_personne_fr && data.prenom_personne_fr.trim().length > 0,
      nom_personne_ar: !!data.nom_personne_ar && data.nom_personne_ar.trim().length > 0,
      prenom_personne_ar: !!data.prenom_personne_ar && data.prenom_personne_ar.trim().length > 0,
      date_naissance: !!data.date_naissance,
      lieu_naissance_fr: !!data.lieu_naissance_fr,
      lieu_naissance_ar: !!data.lieu_naissance_ar,
      nationalite_fr: !!data.nationalite_fr,
      nationalite_ar: !!data.nationalite_ar,
      num_tlf_personne: !!data.num_tlf_personne && /^[0-9]{10}$/.test(data.num_tlf_personne),
      adresse_fr: !!data.adresse_fr && data.adresse_fr.trim().length > 0,
      adresse_ar: !!data.adresse_ar && data.adresse_ar.trim().length > 0,
      sexe_personne_fr: !!data.sexe_personne_fr,
      sexe_personne_ar: !!data.sexe_personne_ar,
      groupage: !!data.groupage,
      carte_nationale: !!data.carte_nationale,
      photo: !!data.photo,
      isLoadingWilayas: !isLoadingWilayas,
    };

    const isComplete = Object.values(checks).every(check => check === true);
    console.log('isFormComplete :', { isComplete, checks });
    return isComplete && !ninError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateNin(data.id_nin_personne)) return;
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-5xl bg-white shadow-md rounded-lg p-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      {/* {isLoadingWilayas && (
        <div className="text-center text-gray-600">Chargement des wilayas...</div>
      )} */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Numéro NIN</label>
          <input
            type="text"
            name="id_nin_personne"
            value={data.id_nin_personne || ''}
            onChange={handleNinChange}
            maxLength={18}
            className={`bg-gray-50 border ${ninError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
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
        <input
          type="file"
          name="carte_nationale"
          onChange={onFileChange}
          accept="application/pdf"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">Photo</label>
        <input
          type="file"
          name="photo"
          onChange={onFileChange}
          accept="image/jpeg,image/png,image/jpg"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
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