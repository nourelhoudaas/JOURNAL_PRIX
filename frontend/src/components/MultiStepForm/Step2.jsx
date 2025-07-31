import React, { useState } from 'react';

export default function Step2({ data, onChange, onNext, onBack }) {
  const secteurs = ['public', 'prive'];
  const categories = ['media audio', 'media ecrit', 'electronique'];
  const specialites = ['Général', 'Sport', 'Information', 'Culture', 'Économie'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-md rounded-xl max-w-3xl mx-auto space-y-6"
    >
      <h2 className="text-2xl font-bold text-blue-700 border-b pb-2">
        💼 Informations professionnelles
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="fonction_fr"
          value={data.fonction_fr || ''}
          onChange={onChange}
          placeholder="Fonction (FR)"
          className="input"
        />
        <input
          name="fonction_ar"
          value={data.fonction_ar || ''}
          onChange={onChange}
          placeholder="الوظيفة"
          className="input text-right"
        />

        <input
          name="id_professional_card"
          value={data.id_professional_card || ''}
          onChange={onChange}
          placeholder="N° carte professionnelle"
          className="input"
        />

        <select
          name="secteur_travail"
          value={data.secteur_travail || ''}
          onChange={onChange}
          className="input"
        >
          <option value="">Secteur de travail</option>
          {secteurs.map((s, index) => (
            <option key={index} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Catégorie – affichée seulement si secteur = public */}
      {data.secteur_travail === 'public' && (
        <div className="space-y-4">
          <select
            name="categorie"
            value={data.categorie || ''}
            onChange={onChange}
            className="input w-full"
          >
            <option value="">Catégorie</option>
            {categories.map((c, index) => (
              <option key={index} value={c}>
                {c}
              </option>
            ))}
          </select>

          {data.categorie === 'media audio' && (
            <select
              name="type_media"
              value={data.type_media || ''}
              onChange={onChange}
              className="input w-full"
            >
              <option value="">Type Média</option>
              <option value="tv">TV</option>
              <option value="radio">Radio</option>
            </select>
          )}

          {data.type_media === 'tv' && (
            <select
              name="tv"
              value={data.tv || ''}
              onChange={onChange}
              className="input w-full"
            >
              <option value="">TV</option>
              <option value="regionale">Régionale</option>
              <option value="nationale">Nationale</option>
            </select>
          )}

          {data.type_media === 'radio' && (
            <select
              name="radio"
              value={data.radio || ''}
              onChange={onChange}
              className="input w-full"
            >
              <option value="">Radio</option>
              <option value="publique">Publique</option>
              <option value="locale">Locale</option>
            </select>
          )}

          {(data.categorie === 'media ecrit' || data.categorie === 'electronique') && (
            <select
              name="media"
              value={data.media || ''}
              onChange={onChange}
              className="input w-full"
            >
              <option value="">Type</option>
              <option value="ecrit">Écrit</option>
              <option value="electronique">Électronique</option>
            </select>
          )}
        </div>
      )}

      {/* Langue – affichée si secteur = privé */}
      {data.secteur_travail === 'prive' && (
        <select
          name="langue"
          value={data.langue || ''}
          onChange={onChange}
          className="input w-full"
        >
          <option value="">Langue</option>
          <option value="arabe">Arabe</option>
          <option value="français">Français</option>
        </select>
      )}

      {/* Spécialité – affichée si médias ou privé */}
      {(data.type_media === 'tv' || data.media || data.secteur_travail === 'prive') && (
        <select
          name="specialite"
          value={data.specialite || ''}
          onChange={onChange}
          className="input w-full"
        >
          <option value="">Spécialité</option>
          {specialites.map((sp, index) => (
            <option key={index} value={sp}>
              {sp}
            </option>
          ))}
        </select>
      )}

      {/* Établissement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="nom_etablissement"
          value={data.nom_etablissement || ''}
          onChange={onChange}
          placeholder="Nom établissement"
          className="input"
        />
        <input
          name="email"
          value={data.email || ''}
          onChange={onChange}
          placeholder="Email établissement"
          className="input"
        />
        <input
          name="tel"
          value={data.tel || ''}
          onChange={onChange}
          placeholder="Téléphone établissement"
          className="input"
        />
      </div>

      {/* Boutons navigation */}
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
