import React from 'react';

export default function Step2({ data, onChange, onNext, onBack }) {
  const secteurs = ['public', 'prive'];
  const categories = ['media audio', 'media ecrit', 'electronique'];
  const specialites = ['Culturel', 'Economique', 'publique', 'sport', 'Santé', 'Touristique', 'Agricole', 'Technologique', 'Automobile'];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Log form data for debugging
    console.log('Step2 form data:', data);
    onNext();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full max-w-5xl bg-white shadow-md rounded-lg p-8"
    >
      <div className="grid gap-6 mb-6 md:grid-cols-2">
      <div >
        <label className="block mb-2 text-sm font-medium text-gray-900">N° carte professionnelle</label>
        <input
          name="id_professional_card"
          value={data.id_professional_card || ''}
          onChange={onChange}
          placeholder="N° carte professionnelle"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>
      <div >
        <label className="block mb-2 text-sm font-medium text-gray-900">N° atestation de travail</label>
        <input
          name="id_professional_card"
          value={data.id_professional_card || ''}
          onChange={onChange}
          placeholder="N° carte professionnelle"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>
      
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Fonction (FR)</label>
          <input
            name="fonction_fr"
            value={data.fonction_fr || ''}
            onChange={onChange}
            placeholder="Fonction (FR)"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 ">Fonction (AR)</label>
          <input
            name="fonction_ar"
            value={data.fonction_ar || ''}
            onChange={onChange}
            placeholder="الوظيفة"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-right"
            required
          />
        </div>
      </div>

      <div className="mb-6 w-full">
        <label className="block mb-2 text-sm font-medium text-gray-900">Secteur de travail</label>
        <select
          name="secteur_travail"
          value={data.secteur_travail || ''}
          onChange={onChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        >
          <option value="">Sélectionnez un Secteur de travail</option>
          {secteurs.map((s, index) => (
            <option key={index} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.secteur_travail === 'public' && (
          <>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Catégorie</label>
              <select
                name="categorie"
                value={data.categorie || ''}
                onChange={onChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="">Catégorie</option>
                {categories.map((c, index) => (
                  <option key={index} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {data.categorie === 'media audio' && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Type Média</label>
                <select
                  name="type_media"
                  value={data.type_media || ''}
                  onChange={onChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value="">Type Média</option>
                  <option value="tv">TV</option>
                  <option value="radio">Radio</option>
                </select>
              </div>
            )}

            {data.type_media === 'tv' && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">TV</label>
                <select
                  name="tv"
                  value={data.tv || ''}
                  onChange={onChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value="">TV</option>
                  <option value="regionale">Régionale</option>
                  <option value="nationale">Nationale</option>
                </select>
              </div>
            )}

            {data.type_media === 'radio' && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Radio</label>
                <select
                  name="radio"
                  value={data.radio || ''}
                  onChange={onChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value="">Radio</option>
                  <option value="publique">Publique</option>
                  <option value="locale">Locale</option>
                </select>
              </div>
            )}

            {(data.categorie === 'media ecrit' || data.categorie === 'electronique') && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Type</label>
                <select
                  name="media"
                  value={data.media || ''}
                  onChange={onChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value="">Type</option>
                  <option value="ecrit">Écrit</option>
                  <option value="electronique">Électronique</option>
                </select>
              </div>
            )}
          </>
        )}

        {data.secteur_travail === 'prive' && (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Langue</label>
            <select
              name="langue"
              value={data.langue || ''}
              onChange={onChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="">Langue</option>
              <option value="arabe">Arabe</option>
              <option value="français">Français</option>
            </select>
          </div>
        )}

        {(data.type_media === 'tv' || data.media || data.secteur_travail === 'prive') && (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Spécialité</label>
            <select
              name="specialite"
              value={data.specialite || ''}
              onChange={onChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="">Spécialité</option>
              {specialites.map((sp, index) => (
                <option key={index} value={sp}>
                  {sp}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Nom établissement (FR)</label>
          <input
            name="nom_etablissement"
            value={data.nom_etablissement || ''}
            onChange={onChange}
            placeholder="Nom établissement (FR)"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Nom établissement (AR)</label>
          <input
            name="nom_etablissement_ar"
            value={data.nom_etablissement_ar || ''}
            onChange={onChange}
            placeholder="اسم المؤسسة"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-right"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Email établissement</label>
          <input
            name="email"
            value={data.email || ''}
            onChange={onChange}
            placeholder="Email établissement"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Téléphone établissement</label>
          <input
            name="tel"
            value={data.tel || ''}
            onChange={onChange}
            placeholder="Téléphone établissement"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
      </div>
            <div>
        <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="carte_nationale">
          Attestation de travail
        </label>
        <input
          type="file"
          name="carte_nationale"
          //onChange={onFileChange}
          accept="application/pdf"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="btn bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Retour
        </button>
        <button
          type="submit"
          className="btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Suivant
        </button>
      </div>
    </form>
  );
}