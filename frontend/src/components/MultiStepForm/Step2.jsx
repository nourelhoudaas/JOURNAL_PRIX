import React, { useCallback, useState } from 'react';

export default function Step2({ data, onChange, onFileChange, onNext, onBack, error }) {
  const secteurs = ['public', 'prive'];
  const categories = ['media audio', 'media ecrit', 'electronique'];
  const specialites = ['Culturel', 'Economique', 'publique', 'sport', 'Santé', 'Touristique', 'Agricole', 'Technologique', 'Automobile'];

  const [numAttesError, setNumAttesError] = useState('');
  const [numAttesExistsMessage, setNumAttesExistsMessage] = useState('');
  const [isNumAttesDisabled, setIsNumAttesDisabled] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  const validateNumAttes = useCallback(async (value) => {
    if (!value) {
      setNumAttesError('La référence de l\'attestation de travail est requise.');
      setNumAttesExistsMessage('');
      return false;
    }

    try {
      const response = await fetch(`http://localhost:8000/check-num-attes?num_attes=${value}`, {
        headers: { Accept: 'application/json' },
      });
      const result = await response.json();

      if (response.ok) {
        if (result.exists) {
          setNumAttesExistsMessage('Cette référence existe déjà dans la base de données.');
          setIsNumAttesDisabled(true);
          if (result.data) {
            onChange({
              target: {
                name: 'batch',
                value: {
                  id_professional_card: result.data.id_professional_card || '',
                  num_attes: result.data.num_attes || '',
                  fonction_fr: result.data.fonction_fr || '',
                  fonction_ar: result.data.fonction_ar || '',
                  secteur_travail: result.data.secteur_travail || '',
                  categorie: result.data.categorie || '',
                  type_media: result.data.type_media || '',
                  tv: result.data.tv || '',
                  radio: result.data.radio || '',
                  media: result.data.media || '',
                  langue: result.data.langue || '',
                  specialite: result.data.specialite || '',
                  nom_etablissement: result.data.nom_etablissement || '',
                  nom_etablissement_ar: result.data.nom_etablissement_ar || '',
                  email: result.data.email || '',
                  tel: result.data.tel || '',
                  fichiers: result.data.fichiers || [],
                },
              },
            });
          }
        } else {
          setNumAttesExistsMessage('');
          setIsNumAttesDisabled(false);
          // Réinitialiser les champs si la référence n'existe pas
          onChange({
            target: {
              name: 'batch',
              value: {
                num_attes: value,
                id_professional_card: '',
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
              },
            },
          });
        }
        setNumAttesError('');
        return true;
      } else {
        setNumAttesError(result.message || 'Erreur lors de la vérification de la référence.');
        setNumAttesExistsMessage('');
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de la référence :', error);
      setNumAttesError('Erreur lors de la vérification de la référence.');
      setNumAttesExistsMessage('');
      return false;
    }
  }, [onChange]);

  const handleNumAttesChange = useCallback(
    async (e) => {
      const { value } = e.target;
      if (value === data.num_attes) return;
      onChange(e);
      await validateNumAttes(value);
    },
    [data.num_attes, onChange, validateNumAttes]
  );

  const isFormComplete = useCallback(() => {
    const checks = {
      id_professional_card: !!data.id_professional_card,
      num_attes: !!data.num_attes,
      fonction_fr: !!data.fonction_fr,
      fonction_ar: !!data.fonction_ar,
      secteur_travail: !!data.secteur_travail,
      categorie: data.secteur_travail !== 'public' || !!data.categorie,
      type_media: data.categorie !== 'media audio' || !!data.type_media,
      tv: data.type_media !== 'tv' || !!data.tv,
      radio: data.type_media !== 'radio' || !!data.radio,
      media: (data.categorie !== 'media ecrit' && data.categorie !== 'electronique') || !!data.media,
      email: !!data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email),
      tel: !!data.tel && /^[0-9]{10}$/.test(data.tel),
      attestation_travail: data.attestation_travail instanceof File || (data.fichiers && data.fichiers.some(f => f.type === 'attestation_travail')),
    };

    return Object.values(checks).every(value => !!value) && !numAttesError;
  }, [data, numAttesError]);

  const validateFormErrors = useCallback(() => {
    const checks = {
      id_professional_card: !!data.id_professional_card,
      num_attes: !!data.num_attes,
      fonction_fr: !!data.fonction_fr,
      fonction_ar: !!data.fonction_ar,
      secteur_travail: !!data.secteur_travail,
      categorie: data.secteur_travail !== 'public' || !!data.categorie,
      type_media: data.categorie !== 'media audio' || !!data.type_media,
      tv: data.type_media !== 'tv' || !!data.tv,
      radio: data.type_media !== 'radio' || !!data.radio,
      media: (data.categorie !== 'media ecrit' && data.categorie !== 'electronique') || !!data.media,
      email: !!data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email),
      tel: !!data.tel && /^[0-9]{10}$/.test(data.tel),
      attestation_travail: data.attestation_travail instanceof File || (data.fichiers && data.fichiers.some(f => f.type === 'attestation_travail')),
    };

    const errors = [];
    if (!checks.id_professional_card) errors.push('Le numéro de carte professionnelle est requis.');
    if (!checks.num_attes) errors.push('La référence de l\'attestation de travail est requise.');
    if (!checks.fonction_fr) errors.push('La fonction (FR) est requise.');
    if (!checks.fonction_ar) errors.push('La fonction (AR) est requise.');
    if (!checks.secteur_travail) errors.push('Le secteur de travail est requis.');
    if (!checks.categorie) errors.push('La catégorie est requise.');
    if (!checks.type_media) errors.push('Le type de média est requis.');
    if (!checks.tv) errors.push('Le type de TV est requis.');
    if (!checks.radio) errors.push('Le type de radio est requis.');
    if (!checks.media) errors.push('Le média est requis.');
    if (!checks.email) errors.push('L\'email est invalide.');
    if (!checks.tel) errors.push('Le téléphone est invalide.');
    if (!checks.attestation_travail) errors.push('L\'attestation de travail est requise (téléchargez un fichier ou utilisez un fichier existant).');

    setFormErrors(errors);
    return errors.length === 0 && !numAttesError;
  }, [data, numAttesError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAttesValid = await validateNumAttes(data.num_attes);
    if (!numAttesValid) return;
    if (!validateFormErrors()) {
      console.error('Formulaire incomplet, vérifiez les champs.');
      return;
    }
    onNext();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full max-w-5xl bg-white shadow-md rounded-lg p-8"
    >
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {numAttesExistsMessage && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          {numAttesExistsMessage}
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
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="id_professional_card">
            N° carte professionnelle
          </label>
          <input
            type="number"
            name="id_professional_card"
            value={data.id_professional_card || ''}
            onChange={onChange}
            placeholder="Numéro de la carte professionnelle"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="num_attes">
            Référence attestation de travail
          </label>
          <input
            type="text"
            name="num_attes"
            value={data.num_attes || ''}
            onChange={handleNumAttesChange}
            placeholder="Référence de l'attestation de travail"
            className={`bg-gray-50 border ${numAttesError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${isNumAttesDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            disabled={isNumAttesDisabled}
            required
          />
          {numAttesError && (
            <p className="mt-1 text-sm text-red-600">{numAttesError}</p>
          )}
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
          <label className="block mb-2 text-sm font-medium text-gray-900">Fonction (AR)</label>
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
          <option value="public">Public</option>
          <option value="prive">Privé</option>
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
        <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="attestation_travail">
          Attestation de travail
        </label>
        {data.fichiers && data.fichiers.some(f => f.type === 'attestation_travail') && (
          <div className="mb-2">
            <p className="text-sm text-gray-600">
              Fichier existant :{' '}
              {data.fichiers.find(f => f.type === 'attestation_travail').nom_fichier_fr}{' '}
              <a
                href={`http://localhost:8000/storage/${data.fichiers.find(f => f.type === 'attestation_travail').file_path}`}
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
          name="attestation_travail"
          onChange={onFileChange}
          accept="application/pdf"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required={!data.fichiers || !data.fichiers.some(f => f.type === 'attestation_travail')}
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
          className="btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isFormComplete()}
        >
          Suivant
        </button>
      </div>
    </form>
  );
}