import React, { useCallback, useState, useEffect } from 'react';

export default function Step2({ data, onChange, onFileChange, onNext, onBack, error, setIsProfessionalCardValidated, onCheckProfessionalCard }) {
  const secteurs = ['Public', 'Privé'];
  const categories = ['Média audio', 'Média écrit et électronique'];
  const specialites = ['Culturel', 'Economique', 'Publique', 'Sport', 'Santé', 'Touristique', 'Agricole', 'Technologique', 'Automobile'];

  const [professionalCardError, setProfessionalCardError] = useState('');
  const [professionalCardExistsMessage, setProfessionalCardExistsMessage] = useState('');
  const [isProfessionalCardDisabled, setIsProfessionalCardDisabled] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Log l'état initial du composant pour débogage
  useEffect(() => {
    console.log('📋 État initial de Step2:', { data });
  }, [data]);

  // Vérifie la validité de la carte professionnelle
  const validateProfessionalCard = useCallback(
    async (value) => {
      if (!value) {
        console.log('🚫 id_professional_card vide');
        setProfessionalCardError('Le numéro de carte professionnelle est requis.');
        setProfessionalCardExistsMessage('');
        return false;
      }

      try {
        console.log('🔍 Vérification de la carte professionnelle:', { id_professional_card: value, userId: data.userId });
        const response = await fetch(
          `http://localhost:8000/check-professional-card?id_professional_card=${value}&userId=${data.userId || ''}`,
          { headers: { Accept: 'application/json' } }
        );
        const result = await response.json();
        console.log('📥 Réponse de checkProfessionalCard:', result);

        if (response.ok) {
          if (result.exists && result.data) {
            const categorieValue = result.data.secteur_travail === 'Privé' ? 'Privé' :
              (result.data.categorie && result.data.categorie !== 'unknown' ? result.data.categorie : '');
            const typeMediaValue = result.data.secteur_travail === 'Privé' ? 'Privé' :
              (result.data.type_media && result.data.type_media !== '' ? result.data.type_media : '');
            const radioValue = result.data.radio || ''; // Assurer que radio est bien défini
            const specialiteValue = result.data.specialite || ''; // Assurer que specialite est bien défini

            console.log('✅ Données reçues pour mise à jour', {
              categorie: categorieValue,
              type_media: typeMediaValue,
              radio: radioValue,
              specialite: specialiteValue,
            });

            setProfessionalCardExistsMessage('Carte professionnelle trouvée. Vous pouvez modifier les données.');
            setIsProfessionalCardDisabled(true);
            setProfessionalCardError('');
            setIsProfessionalCardValidated(true);
            onChange({
              target: {
                name: 'batch',
                value: {
                  ...result.data,
                  categorie: categorieValue,
                  type_media: typeMediaValue,
                  radio: radioValue, // Ajout explicite de radio
                  specialite: specialiteValue, // Ajout explicite de specialite
                },
              },
            });
            if (!categorieValue && result.data.secteur_travail === 'Public') {
              console.log('🚫 Catégorie non définie pour secteur public');
              setProfessionalCardError('La catégorie n\'est pas définie pour ce secteur public. Veuillez sélectionner une catégorie.');
              setIsProfessionalCardDisabled(false);
              setIsProfessionalCardValidated(false);
            }
            if (!typeMediaValue && result.data.secteur_travail === 'Public' && categorieValue === 'Média audio') {
              console.log('🚫 Type média non défini pour Média audio');
              setProfessionalCardError('Le type de média n\'est pas défini pour cette catégorie. Veuillez sélectionner un type de média.');
              setIsProfessionalCardDisabled(false);
              setIsProfessionalCardValidated(false);
            }
            return true;
          } else if (result.exists) {
            console.log('🚫 Carte professionnelle déjà utilisée par un autre utilisateur');
            setProfessionalCardError(result.error || 'Cette carte professionnelle appartient déjà à une autre personne.');
            setProfessionalCardExistsMessage('');
            setIsProfessionalCardDisabled(false);
            setIsProfessionalCardValidated(false);
            return false;
          } else {
            console.log('🔎 Nouvelle carte professionnelle détectée');
            setProfessionalCardError('');
            setProfessionalCardExistsMessage('Nouvelle carte professionnelle. Veuillez remplir les informations.');
            setIsProfessionalCardDisabled(false);
            setIsProfessionalCardValidated(false);
            onChange({
              target: {
                name: 'batch',
                value: {
                  id_professional_card: value,
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
                },
              },
            });
            return true;
          }
        } else {
          console.log('🚫 Erreur serveur lors de la vérification', { message: result.message });
          setProfessionalCardError(result.message || 'Cette carte professionnelle appartient déjà à une autre personne.');
          setProfessionalCardExistsMessage('');
          setIsProfessionalCardValidated(false);
          return false;
        }
      } catch (error) {
        console.error('❌ Erreur lors de la vérification de la carte professionnelle:', error);
        setProfessionalCardError('Erreur lors de la vérification de la carte professionnelle.');
        setProfessionalCardExistsMessage('');
        setIsProfessionalCardValidated(false);
        return false;
      }
    },
    [data.userId, onChange, setIsProfessionalCardValidated]
  );

  // Gère le changement du numéro de carte professionnelle
  const handleProfessionalCardChange = useCallback(
    async (e) => {
      const { value } = e.target;
      if (value === data.id_professional_card) return;
      console.log('🔄 Changement de carte professionnelle:', { value });
      onChange(e);
      await validateProfessionalCard(value);
    },
    [data.id_professional_card, onChange, validateProfessionalCard]
  );

  // Gère le changement du type de média et préserve les valeurs existantes
  const handleTypeMediaChange = (e) => {
    const { value } = e.target;
    console.log('🔄 Changement de type_media:', { value });
    onChange({
      target: {
        name: 'type_media',
        value,
      },
    });
    // Réinitialiser les champs dépendants uniquement si nécessaire
    if (value !== 'TV') {
      onChange({ target: { name: 'tv', value: '' } });
    }
    if (value !== 'Radio') {
      onChange({ target: { name: 'radio', value: data.radio || '' } }); // Préserver radio si défini
    }
    if (data.categorie !== 'Média écrit et électronique') {
      onChange({ target: { name: 'media', value: '' } });
    }
    // Préserver specialite si déjà défini
    if (!data.specialite) {
      onChange({ target: { name: 'specialite', value: '' } });
    }
  };

  // Gère le changement du secteur de travail
  const handleSecteurChange = (e) => {
    const { value } = e.target;
    console.log('🔄 Changement de secteur_travail:', { value });
    onChange({
      target: {
        name: 'secteur_travail',
        value,
      },
    });
    if (value === 'Privé') {
      onChange({ target: { name: 'categorie', value: 'Privé' } });
      onChange({ target: { name: 'type_media', value: 'Privé' } });
      onChange({ target: { name: 'tv', value: '' } });
      onChange({ target: { name: 'radio', value: '' } });
      onChange({ target: { name: 'media', value: '' } });
      // Préserver specialite si déjà défini
      if (!data.specialite) {
        onChange({ target: { name: 'specialite', value: '' } });
      }
    } else {
      onChange({ target: { name: 'categorie', value: data.categorie || '' } }); // Préserver categorie
      onChange({ target: { name: 'type_media', value: data.type_media || '' } }); // Préserver type_media
      onChange({ target: { name: 'tv', value: data.tv || '' } }); // Préserver tv
      onChange({ target: { name: 'radio', value: data.radio || '' } }); // Préserver radio
      onChange({ target: { name: 'media', value: data.media || '' } }); // Préserver media
      onChange({ target: { name: 'langue', value: data.langue || '' } }); // Préserver langue
      // Préserver specialite si déjà défini
      if (!data.specialite) {
        onChange({ target: { name: 'specialite', value: '' } });
      }
    }
  };

  // Vérifie si le formulaire est complet
  const isFormComplete = useCallback(() => {
    const baseChecks = {
      id_professional_card: !!data.id_professional_card,
      num_attes: !!data.num_attes,
      fonction_fr: !!data.fonction_fr,
      fonction_ar: !!data.fonction_ar,
      secteur_travail: !!data.secteur_travail,
      email: !!data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email),
      tel: !!data.tel && /^(\+?\d{8,15})$/.test(data.tel),
      attestation_travail:
        data.attestation_travail instanceof File ||
        (data.fichiers && data.fichiers.some((f) => f.type === 'attestation_travail')),
      nom_etablissement: !!data.nom_etablissement,
      nom_etablissement_ar: !!data.nom_etablissement_ar,
    };

    if (data.secteur_travail === 'Public') {
      const publicChecks = {
        categorie: !!data.categorie && data.categorie !== 'unknown' && ['Média audio', 'Média écrit et électronique'].includes(data.categorie),
        type_media: data.categorie === 'Média audio' ? !!data.type_media && ['TV', 'Radio'].includes(data.type_media) : true,
        tv: data.type_media === 'TV' ? !!data.tv && ['Régionale', 'Nationale'].includes(data.tv) : true,
        radio: data.type_media === 'Radio' ? !!data.radio && ['Publique', 'Locale'].includes(data.radio) : true,
        media: data.categorie === 'Média écrit et électronique' ? !!data.media && ['Écrit', 'Électronique'].includes(data.media) : true,
        specialite: (data.type_media === 'TV' || data.categorie === 'Média écrit et électronique') ? !!data.specialite && specialites.includes(data.specialite) : true,
      };
      console.log('🔍 Validation formulaire Public:', { baseChecks, publicChecks });
      return Object.values({ ...baseChecks, ...publicChecks }).every(Boolean);
    }

    if (data.secteur_travail === 'Privé') {
      const priveChecks = {
        categorie: data.categorie === 'Privé',
        type_media: data.type_media === 'Privé',
        langue: !!data.langue && ['Arabe', 'Français'].includes(data.langue),
        specialite: !!data.specialite && specialites.includes(data.specialite),
      };
      console.log('🔍 Validation formulaire Privé:', { baseChecks, priveChecks });
      return Object.values({ ...baseChecks, ...priveChecks }).every(Boolean);
    }

    console.log('🔍 Formulaire incomplet, secteur_travail non défini');
    return false;
  }, [data]);

  // Valide les erreurs du formulaire
  const validateFormErrors = useCallback(() => {
    const errors = {};

    if (!data.id_professional_card) errors.id_professional_card = 'Le numéro de carte professionnelle est requis.';
    if (!data.num_attes) errors.num_attes = "La référence de l'attestation de travail est requise.";
    if (!data.fonction_fr) errors.fonction_fr = 'La fonction (FR) est requise.';
    if (!data.fonction_ar) errors.fonction_ar = 'La fonction (AR) est requise.';
    if (!data.secteur_travail) errors.secteur_travail = 'Le secteur de travail est requis.';
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "L'email est invalide ou requis.";
    if (!data.tel || !/^(\+?\d{8,15})$/.test(data.tel)) errors.tel = 'Le téléphone est invalide ou requis.';
    if (!data.attestation_travail && !(data.fichiers && data.fichiers.some((f) => f.type === 'attestation_travail'))) {
      errors.attestation_travail = "L'attestation de travail est requise.";
    }
    if (!data.nom_etablissement) errors.nom_etablissement = "Le nom de l'établissement (FR) est requis.";
    if (!data.nom_etablissement_ar) errors.nom_etablissement_ar = "Le nom de l'établissement (AR) est requis.";

    if (data.secteur_travail === 'Public') {
      if (!data.categorie || data.categorie === 'unknown' || !['Média audio', 'Média écrit et électronique'].includes(data.categorie)) {
        errors.categorie = 'La catégorie est requise et doit être "Média audio" ou "Média écrit et électronique".';
      }
      if (data.categorie === 'Média audio' && (!data.type_media || !['TV', 'Radio'].includes(data.type_media))) {
        errors.type_media = 'Le type de média est requis et doit être "TV" ou "Radio".';
      }
      if (data.type_media === 'TV' && (!data.tv || !['Régionale', 'Nationale'].includes(data.tv))) {
        errors.tv = 'Le type de TV est requis et doit être "Régionale" ou "Nationale".';
      }
      if (data.type_media === 'Radio' && (!data.radio || !['Publique', 'Locale'].includes(data.radio))) {
        errors.radio = 'Le type de radio est requis et doit être "Publique" ou "Locale".';
      }
      if (data.categorie === 'Média écrit et électronique' && (!data.media || !['Écrit', 'Électronique'].includes(data.media))) {
        errors.media = 'Le type de média écrit est requis et doit être "Écrit" ou "Électronique".';
      }
      if ((data.type_media === 'TV' || data.categorie === 'Média écrit et électronique') && (!data.specialite || !specialites.includes(data.specialite))) {
        errors.specialite = 'La spécialité est requise et doit être valide.';
      }
    }

    if (data.secteur_travail === 'Privé') {
      if (data.categorie !== 'Privé') errors.categorie = 'La catégorie doit être "Privé" pour le secteur privé.';
      if (data.type_media !== 'Privé') errors.type_media = 'Le type de média doit être "Privé" pour le secteur privé.';
      if (!data.langue || !['Arabe', 'Français'].includes(data.langue)) {
        errors.langue = 'La langue est requise et doit être "Arabe", "Français" .';
      }
      if (!data.specialite || !specialites.includes(data.specialite)) {
        errors.specialite = 'La spécialité est requise et doit être valide.';
      }
    }

    console.log('🔍 Erreurs de validation du formulaire:', errors);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [data]);

  // Gère la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📤 Soumission de Step2:', { data });
    const professionalCardValid = await validateProfessionalCard(data.id_professional_card);
    if (!professionalCardValid) {
      console.error('❌ Carte professionnelle invalide.');
      return;
    }
    if (!validateFormErrors()) {
      console.error('❌ Formulaire incomplet, vérifiez les champs.');
      return;
    }
    console.log('✅ Formulaire valide, passage à l\'étape suivante.');
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-5xl bg-white shadow-md rounded-lg p-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      {professionalCardError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {professionalCardError}
        </div>
      )}
      {professionalCardExistsMessage && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          {professionalCardExistsMessage}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Carte professionnelle</label>
          <input
            name="id_professional_card"
            value={data.id_professional_card || ''}
            onChange={handleProfessionalCardChange}
            placeholder="Carte professionnelle"
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${isProfessionalCardDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            required
          />
          {formErrors.id_professional_card && <p className="text-red-500 text-sm">{formErrors.id_professional_card}</p>}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Réf Attestation de travail</label>
          <input
            name="num_attes"
            value={data.num_attes || ''}
            onChange={onChange}
            placeholder="Réf Attestation de travail"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
          {formErrors.num_attes && <p className="text-red-500 text-sm">{formErrors.num_attes}</p>}
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
          {formErrors.fonction_fr && <p className="text-red-500 text-sm">{formErrors.fonction_fr}</p>}
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
          {formErrors.fonction_ar && <p className="text-red-500 text-sm">{formErrors.fonction_ar}</p>}
        </div>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">Secteur de travail</label>
        <select
          name="secteur_travail"
          value={data.secteur_travail || ''}
          onChange={handleSecteurChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        >
          <option value="">Secteur de travail</option>
          {secteurs.map((s, index) => (
            <option key={index} value={s}>
              {s}
            </option>
          ))}
        </select>
        {formErrors.secteur_travail && <p className="text-red-500 text-sm">{formErrors.secteur_travail}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.secteur_travail === 'Public' && (
          <>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Catégorie</label>
              <select
                name="categorie"
                value={data.categorie || ''}
                onChange={onChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              >
                <option value="">Catégorie</option>
                {categories.map((c, index) => (
                  <option key={index} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {formErrors.categorie && <p className="text-red-500 text-sm">{formErrors.categorie}</p>}
            </div>
            {data.categorie === 'Média audio' && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Type Média</label>
                <select
                  name="type_media"
                  value={data.type_media || ''}
                  onChange={handleTypeMediaChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  <option value="">Type Média</option>
                  <option value="TV">TV</option>
                  <option value="Radio">Radio</option>
                </select>
                {formErrors.type_media && <p className="text-red-500 text-sm">{formErrors.type_media}</p>}
              </div>
            )}
            {data.categorie === 'Média audio' && data.type_media === 'TV' && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">TV</label>
                <select
                  name="tv"
                  value={data.tv || ''}
                  onChange={onChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  <option value="">TV</option>
                  <option value="Régionale">Régionale</option>
                  <option value="Nationale">Nationale</option>
                </select>
                {formErrors.tv && <p className="text-red-500 text-sm">{formErrors.tv}</p>}
              </div>
            )}
            {data.categorie === 'Média audio' && data.type_media === 'Radio' && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Radio</label>
                <select
                  name="radio"
                  value={data.radio || ''}
                  onChange={onChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  <option value="">Radio</option>
                  <option value="Publique">Publique</option>
                  <option value="Locale">Locale</option>
                </select>
                {formErrors.radio && <p className="text-red-500 text-sm">{formErrors.radio}</p>}
              </div>
            )}
            {data.categorie === 'Média écrit et électronique' && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Type</label>
                <select
                  name="media"
                  value={data.media || ''}
                  onChange={onChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  <option value="">Type</option>
                  <option value="Écrit">Écrit</option>
                  <option value="Électronique">Électronique</option>
                </select>
                {formErrors.media && <p className="text-red-500 text-sm">{formErrors.media}</p>}
              </div>
            )}
          </>
        )}
        {data.secteur_travail === 'Privé' && (
          <>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Langue</label>
              <select
                name="langue"
                value={data.langue || ''}
                onChange={onChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              >
                <option value="">Langue</option>
                <option value="Arabe">Arabe</option>
                <option value="Français">Français</option>
                
              </select>
              {formErrors.langue && <p className="text-red-500 text-sm">{formErrors.langue}</p>}
            </div>
          </>
        )}
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
          {formErrors.specialite && <p className="text-red-500 text-sm">{formErrors.specialite}</p>}
        </div>
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
          {formErrors.nom_etablissement && <p className="text-red-500 text-sm">{formErrors.nom_etablissement}</p>}
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
          {formErrors.nom_etablissement_ar && <p className="text-red-500 text-sm">{formErrors.nom_etablissement_ar}</p>}
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
          {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
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
          {formErrors.tel && <p className="text-red-500 text-sm">{formErrors.tel}</p>}
        </div>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="attestation_travail">
          Attestation de travail
        </label>
        {data.fichiers && data.fichiers.some((f) => f.type === 'attestation_travail') && (
          <div className="mb-2">
            <p className="text-sm text-gray-600">
              Fichier existant :{' '}
              {data.fichiers.find((f) => f.type === 'attestation_travail').nom_fichier_fr}{' '}
              <a
                href={`http://localhost:8000/storage/${data.fichiers.find((f) => f.type === 'attestation_travail').file_path}`}
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
          required={!data.fichiers || !data.fichiers.some((f) => f.type === 'attestation_travail')}
        />
        {formErrors.attestation_travail && <p className="text-red-500 text-sm">{formErrors.attestation_travail}</p>}
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
          disabled={!isFormComplete() || !!professionalCardError}
        >
          Suivant
        </button>
      </div>
    </form>
  );
}