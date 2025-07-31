import React, { useState } from 'react';

export default function Step1({ data, onChange, onFileChange, onNext, error }) {
  const [ninError, setNinError] = useState('');

  const handleNinChange = (e) => {
    const { name, value } = e.target;
    if (/^\d{0,18}$/.test(value)) {
      if (value.length === 18) {
        setNinError('');
      } else {
        setNinError('Le NIN doit contenir exactement 18 chiffres.');
      }
      onChange(e);
    } else {
      setNinError('Le NIN doit contenir uniquement des chiffres.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ninError && data.id_nin_personne?.length === 18) {
      onNext();
    } else {
      setNinError('Veuillez entrer un NIN valide de 18 chiffres.');
    }
  };

  const logFileChange = (e) => {
    const { name, files } = e.target;
    onFileChange(e);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow flex items-start justify-center p-4">
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-5xl bg-white shadow-md rounded-lg p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700">Numéro NIN</label>
              <input
                type="text"
                name="id_nin_personne"
                value={data.id_nin_personne || ''}
                onChange={handleNinChange}
                maxLength={18}
                className={`w-full px-4 py-2 border rounded ${ninError ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="18 chiffres"
              />
              {ninError && <p className="text-red-500 text-xs mt-1">{ninError}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-700">Téléphone</label>
              <input
                name="num_tlf"
                value={data.num_tlf || ''}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                placeholder="Téléphone"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Nom (FR)</label>
              <input
                name="nom_fr"
                value={data.nom_fr || ''}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                placeholder="Nom"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Prénom (FR)</label>
              <input
                name="prenom_fr"
                value={data.prenom_fr || ''}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                placeholder="Prénom"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Nom (AR)</label>
              <input
                name="nom_ar"
                value={data.nom_ar || ''}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded text-right"
                placeholder="Nom (AR)"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Prénom (AR)</label>
              <input
                name="prenom_ar"
                value={data.prenom_ar || ''}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded text-right"
                placeholder="Prénom (AR)"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Date de naissance</label>
              <input
                type="date"
                name="date_naissance"
                value={data.date_naissance || ''}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Groupe sanguin</label>
              <input
                name="groupage"
                value={data.groupage || ''}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                placeholder="Groupe sanguin"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Lieu de naissance (FR)</label>
              <input
                name="lieu_naissance_fr"
                value={data.lieu_naissance_fr || ''}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                placeholder="Lieu de naissance (FR)"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Lieu de naissance (AR)</label>
              <input
                name="lieu_naissance_ar"
                value={data.lieu_naissance_ar || ''}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded text-right"
                placeholder="Lieu de naissance (AR)"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Nationalité (FR)</label>
              <input
                name="nationalite_fr"
                value={data.nationalite_fr || ''}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                placeholder="Nationalité (FR)"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Nationalité (AR)</label>
              <input
                name="nationalite_ar"
                value={data.nationalite_ar || ''}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded text-right"
                placeholder="Nationalité (AR)"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Adresse (FR)</label>
              <input
                name="adresse_fr"
                value={data.adresse_fr || ''}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                placeholder="Adresse (FR)"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Adresse (AR)</label>
              <input
                name="adresse_ar"
                value={data.adresse_ar || ''}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded text-right"
                placeholder="Adresse (AR)"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Sexe (FR)</label>
              <input
                name="sexe_personne_fr"
                value={data.sexe_personne_fr || ''}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                placeholder="Sexe (FR)"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Sexe (AR)</label>
              <input
                name="sexe_personne_ar"
                value={data.sexe_personne_ar || ''}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded text-right"
                placeholder="Sexe (AR)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700">Carte nationale</label>
            <input
              type="file"
              name="carte_nationale"
              onChange={logFileChange}
              accept="application/pdf"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Photo</label>
            <input
              type="file"
              name="photo"
              onChange={logFileChange}
              accept="image/*"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
              disabled={ninError || !data.id_nin_personne || data.id_nin_personne.length !== 18}
            >
              Next Step →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
