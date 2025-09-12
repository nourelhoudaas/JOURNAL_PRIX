import React, { useCallback, useState, useEffect, useRef } from 'react';

export default function Step2({ data, onChange, onFileChange, onNext, onBack, error, setIsProfessionalCardValidated, interfaceLocale, t }) {
  const [professionalCardError, setProfessionalCardError] = useState('');
  const [professionalCardExistsMessage, setProfessionalCardExistsMessage] = useState('');
  const [isProfessionalCardDisabled, setIsProfessionalCardDisabled] = useState(false);
  const [numAttesError, setNumAttesError] = useState('');
  const [isNumAttesDisabled, setIsNumAttesDisabled] = useState(false);
  const [formErrors, setFormErrors] = useState({});
   const numAttesInputRef = useRef(null); // Référence pour l'input num_attes
  const debounceTimer = useRef(null);
  
  // État pour le nom du fichier sélectionné
  const [selectedFileName, setSelectedFileName] = useState('');
  // Données statiques basées sur les seeders
  const secteurs = [
    { nom_fr_sect: 'Public', nom_ar_sect: 'عام' },
    { nom_fr_sect: 'Privé', nom_ar_sect: 'خاص' },
  ];

  const categories = [
    { nom_fr_etat: 'Média audio', nom_ar_etat: 'وسائط صوتية', id_sect: 2 },
    { nom_fr_etat: 'Média écrit et électronique', nom_ar_etat: 'وسائط مكتوبة و إلكترونية', id_sect: 2 },
    { nom_fr_etat: 'Privé', nom_ar_etat: 'خاص', id_sect: 1 },
  ];

  const typesMedia = [
    { nom_fr_type_media: 'TV', nom_ar_type_media: 'تلفزيون', categorie: 'Média audio' },
    { nom_fr_type_media: 'Radio', nom_ar_type_media: 'راديو', categorie: 'Média audio' },
    { nom_fr_type_media: 'Écrit', nom_ar_type_media: 'مكتوب', categorie: 'Média écrit et électronique' },
    { nom_fr_type_media: 'Électronique', nom_ar_type_media: 'إلكتروني', categorie: 'Média écrit et électronique' },
    { nom_fr_type_media: 'Privé', nom_ar_type_media: 'خاص', categorie: 'Privé' },
  ];

  const specialites = [
    { name_fr: 'Culturel', name_ar: 'ثقافي' },
    { name_fr: 'Economique', name_ar: 'إقتصادي' },
    { name_fr: 'Publique', name_ar: 'عام' },
    { name_fr: 'Sport', name_ar: 'رياضي' },
    { name_fr: 'Santé', name_ar: 'صحي' },
    { name_fr: 'Touristique', name_ar: 'سياحي' },
    { name_fr: 'Agricole', name_ar: 'فلاحي' },
    { name_fr: 'Technologique', name_ar: 'تكنولوجي' },
    { name_fr: 'Automobile', name_ar: 'سيارات' },
  ];

  const langues = [
    { nom_fr: 'Arabe', nom_ar: 'عربي' },
    { nom_fr: 'Français', nom_ar: 'فرنسي' },
  ];

  const tvOptions = [
    { nom_fr: 'Régionale', nom_ar: 'إقليمي' },
    { nom_fr: 'Nationale', nom_ar: 'وطني' },
  ];

  const radioOptions = [
    { nom_fr: 'Publique', nom_ar: 'عمومي' },
    { nom_fr: 'Locale', nom_ar: 'محلي' },
  ];

  // Vérifie la validité de la carte professionnelle (déplacé en haut)
  const validateProfessionalCard = useCallback(
    async (value) => {
      console.log('🔍 [validateProfessionalCard] Début de la validation pour value :', value);
      if (!value) {
        console.log('🚫 [validateProfessionalCard] id_professional_card vide');
        setProfessionalCardError(t.required.replace(':attribute', t.id_professional_card));
        setProfessionalCardExistsMessage('');
        return false;
      }
      try {
        console.log('🔍 [validateProfessionalCard] Vérification de la carte professionnelle:', { id_professional_card: value, userId: data.userId, interfaceLocale });
        const response = await fetch(
          `http://localhost:8000/check-professional-card?id_professional_card=${value}&userId=${data.userId || ''}&locale=${interfaceLocale}`,
          { headers: { Accept: 'application/json' } }
        );
        const result = await response.json();
        console.log('📥 [validateProfessionalCard] Réponse de checkProfessionalCard:', result);
        if (response.ok) {
          if (result.exists && result.data) {
            const categorieValue = result.data.secteur_travail === 'Privé' ? 'Privé' :
              (result.data.categorie && result.data.categorie !== 'unknown' ? result.data.categorie : '');
            const typeMediaValue = result.data.secteur_travail === 'Privé' ? 'Privé' :
              (result.data.type_media && result.data.type_media !== '' ? result.data.type_media : '');
            const radioValue = result.data.radio || '';
            const specialiteValue = result.data.specialite || '';
            console.log('✅ [validateProfessionalCard] Données reçues pour mise à jour', {
              categorie: categorieValue,
              type_media: typeMediaValue,
              radio: radioValue,
              specialite: specialiteValue,
            });
            setProfessionalCardExistsMessage(t.professional_card_found);
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
                  radio: radioValue,
                  specialite: specialiteValue,
                },
              },
            });
            if (!categorieValue && result.data.secteur_travail === 'Public') {
              console.log('🚫 [validateProfessionalCard] Catégorie non définie pour secteur public');
              setProfessionalCardError(t.invalid_category);
              setIsProfessionalCardDisabled(false);
              setIsProfessionalCardValidated(false);
            }
            if (!typeMediaValue && result.data.secteur_travail === 'Public' && categorieValue === 'Média audio') {
              console.log('🚫 [validateProfessionalCard] Type média non défini pour Média audio');
              setProfessionalCardError(t.invalid_media_type);
              setIsProfessionalCardDisabled(false);
              setIsProfessionalCardValidated(false);
            }
            console.log('✅ [validateProfessionalCard] Validation réussie');
            return true;
          } else if (result.exists) {
            console.log('🚫 [validateProfessionalCard] Carte professionnelle déjà utilisée par un autre utilisateur');
            setProfessionalCardError(result.error || t.professional_card_exists);
            setProfessionalCardExistsMessage('');
            setIsProfessionalCardDisabled(false);
            setIsProfessionalCardValidated(false);
            return false;
          } else {
            console.log('🔎 [validateProfessionalCard] Nouvelle carte professionnelle détectée');
            setProfessionalCardError('');
            setProfessionalCardExistsMessage(t.new_professional_card);
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
          console.log('🚫 [validateProfessionalCard] Erreur serveur lors de la vérification', { message: result.message });
          setProfessionalCardError(result.message || t.professional_card_exists);
          setProfessionalCardExistsMessage('');
          setIsProfessionalCardValidated(false);
          return false;
        }
      } catch (error) {
        console.error('❌ [validateProfessionalCard] Erreur lors de la vérification de la carte professionnelle:', error);
        setProfessionalCardError(t.error_check_professional_card);
        setProfessionalCardExistsMessage('');
        setIsProfessionalCardValidated(false);
        return false;
      }
    },
    [data.userId, onChange, setIsProfessionalCardValidated, interfaceLocale, t]
  );

  // Vérifie la validité de num_attes
  // Vérifie la validité de num_attes
  const validateNumAttes = useCallback(
    async (value) => {
      console.log('🔍 [validateNumAttes] Début de la validation pour value :', value);
      if (!value) {
        console.log('🚫 [validateNumAttes] num_attes vide');
        setNumAttesError(t.required.replace(':attribute', t.num_attes));
        return false;
      }
      try {
        console.log('🔍 [validateNumAttes] Vérification de num_attes:', { num_attes: value, interfaceLocale });
        const response = await fetch(
          `http://localhost:8000/check-num-attes?num_attes=${encodeURIComponent(value)}&locale=${interfaceLocale}`,
          {
            headers: { Accept: 'application/json' },
            credentials: 'include',
            method: 'GET',
          }
        );
        console.log('📥 [validateNumAttes] Réponse :', { status: response.status, ok: response.ok });

        let result;
        try {
          result = await response.json();
          console.log('📥 [validateNumAttes] Corps de la réponse :', result);
        } catch (jsonError) {
          console.error('❌ [validateNumAttes] Erreur de parsing JSON :', jsonError);
          setNumAttesError(t.error_check_num_attes);
          return false;
        }

        if (response.ok) {
          console.log('🔎 [validateNumAttes] Nouveau num_attes détecté');
          setNumAttesError('');
          return true;
        } else {
          console.log('🚫 [validateNumAttes] Erreur serveur lors de la vérification', {
            status: response.status,
            message: result.message || result.error,
          });
          if (response.status === 422) {
            if (result.exists) {
              console.log('🚫 [validateNumAttes] num_attes déjà utilisé');
              setNumAttesError(result.error || t.num_attes_exists);
              // Conserver le focus sur l'input
              if (numAttesInputRef.current) {
                numAttesInputRef.current.focus();
              }
              return false;
            } else {
              console.log('🚫 [validateNumAttes] num_attes non fourni ou invalide');
              setNumAttesError(result.error || t.required.replace(':attribute', t.num_attes));
              return false;
            }
          } else {
            setNumAttesError(result.message || t.error_check_num_attes);
            return false;
          }
        }
      } catch (error) {
        console.error('❌ [validateNumAttes] Erreur réseau lors de la vérification de num_attes:', error.message, error.stack);
        setNumAttesError(t.error_check_num_attes);
        return false;
      }
    },
    [interfaceLocale, t]
  );

  // Gère le changement du numéro de carte professionnelle avec debounce pour le check
  const handleProfessionalCardChange = useCallback(
    (e) => {
      const { value } = e.target;
      console.log('🔄 [handleProfessionalCardChange] Changement détecté pour value :', value);
      if (value === data.id_professional_card) return;
      onChange(e);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(async () => {
        await validateProfessionalCard(value);
      }, 500); // Délai de 500ms
    },
    [data.id_professional_card, onChange, validateProfessionalCard]
  );

   // Gère le changement de num_attes
  const handleNumAttesChange = useCallback(
    (e) => {
      const { value } = e.target;
      console.log('🔄 [handleNumAttesChange] Changement détecté pour value :', value);
      onChange(e); // Met à jour formData via la prop onChange
      // Réinitialiser l'erreur si l'utilisateur modifie la valeur
      if (numAttesError) {
        setNumAttesError('');
      }
    },
    [onChange, numAttesError]
  );

  // Gère la perte de focus de num_attes pour déclencher la validation
  const handleNumAttesBlur = useCallback(
    async (e) => {
      const { value } = e.target;
      console.log('🔄 [handleNumAttesBlur] Perte de focus pour value :', value);
      const isValid = await validateNumAttes(value);
      if (!isValid && numAttesError) {
        // Conserver le focus sur l'input
        if (numAttesInputRef.current) {
          numAttesInputRef.current.focus();
        }
      }
    },
    [validateNumAttes, numAttesError]
  );

  // Gère la pression de touche pour bloquer Tab si erreur
  const handleNumAttesKeyDown = useCallback(
    (e) => {
      if (numAttesError && e.key === 'Tab') {
        e.preventDefault();
        if (numAttesInputRef.current) {
          numAttesInputRef.current.focus();
        }
      }
    },
    [numAttesError]
  );

  // Cleanup du timer lors du démontage
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Cleanup du timer lors du démontage du composant
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Gère le changement du type de média et réinitialise les champs non applicables (déplacé en haut)
  const handleTypeMediaChange = (e) => {
    const { value } = e.target;
    console.log('🔄 [handleTypeMediaChange] Changement de type_media:', value);
    onChange({
      target: {
        name: 'type_media',
        value,
      },
    });
    if (value !== 'TV') {
      onChange({ target: { name: 'tv', value: '' } });
    }
    if (value !== 'Radio') {
      onChange({ target: { name: 'radio', value: '' } });
    }
  };

  // Gère le changement du champ media et met à jour type_media (déplacé en haut)
  const handleMediaChange = (e) => {
    const { value } = e.target;
    console.log('🔄 [handleMediaChange] Changement de media:', value);
    onChange({
      target: {
        name: 'media',
        value,
      },
    });
    // Si categorie est Média écrit et électronique, type_media prend la valeur de media
    if (data.categorie === 'Média écrit et électronique') {
      onChange({
        target: {
          name: 'type_media',
          value: value, // Écrit ou Électronique
        },
      });
    }
  };

  // Gère le changement de catégorie et réinitialise les champs dépendants (déplacé en haut)
  const handleCategorieChange = (e) => {
    const { value } = e.target;
    console.log('🔄 [handleCategorieChange] Changement de categorie:', value);
    onChange({
      target: {
        name: 'categorie',
        value,
      },
    });
    if (value !== 'Média audio') {
      onChange({ target: { name: 'type_media', value: '' } });
      onChange({ target: { name: 'tv', value: '' } });
      onChange({ target: { name: 'radio', value: '' } });
    }
    if (value !== 'Média écrit et électronique') {
      onChange({ target: { name: 'media', value: '' } });
    } else {
      // Si catégorie est Média écrit et électronique, type_media prend la valeur de media
      onChange({ target: { name: 'type_media', value: data.media || '' } });
    }
    // Réinitialiser specialite si non applicable
    if (value !== 'Média écrit et électronique' && data.type_media !== 'TV') {
      onChange({ target: { name: 'specialite', value: '' } });
    }
  };

  // Gère le changement du secteur de travail (déplacé en haut)
  const handleSecteurChange = (e) => {
    const { value } = e.target;
    console.log('🔄 [handleSecteurChange] Changement de secteur_travail:', { value });
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
      onChange({ target: { name: 'langue', value: '' } });
    } else {
      onChange({ target: { name: 'categorie', value: '' } });
      onChange({ target: { name: 'type_media', value: '' } });
      onChange({ target: { name: 'tv', value: '' } });
      onChange({ target: { name: 'radio', value: '' } });
      onChange({ target: { name: 'media', value: '' } });
      onChange({ target: { name: 'langue', value: '' } });
      onChange({ target: { name: 'specialite', value: '' } });
    }
  };

  // Gestion du changement de fichier
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name); // Mettre à jour le nom du fichier sélectionné
      onFileChange(e); // Appeler la fonction onFileChange passée en props
    } else {
      setSelectedFileName(''); // Réinitialiser si aucun fichier n'est sélectionné
    }
  };

  // Vérifie si le formulaire est complet (déplacé en haut)
  const isFormComplete = useCallback(() => {
    console.log('🔍 [isFormComplete] Début de la vérification du formulaire complet');
    const baseChecks = {
      id_professional_card: !!data.id_professional_card,
      num_attes: !!data.num_attes,
      fonction_fr: !!data.fonction_fr,
      fonction_ar: !!data.fonction_ar,
      secteur_travail: !!data.secteur_travail && secteurs.some(s => s.nom_fr_sect === data.secteur_travail),
      email: !!data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email),
      tel: !!data.tel && /^(\+?\d{8,15})$/.test(data.tel),
      attestation_travail:
        data.attestation_travail instanceof File ||
        (data.fichiers && data.fichiers.some((f) => f.type === 'attestation_travail')),
      nom_etablissement: !!data.nom_etablissement,
      nom_etablissement_ar: !!data.nom_etablissement_ar,
    };
    console.log('🔍 [isFormComplete] Résultats des checks de base :', baseChecks);
    if (data.secteur_travail === 'Public') {
      const publicChecks = {
        categorie: !!data.categorie && categories.some(c => c.nom_fr_etat === data.categorie && c.nom_fr_etat !== 'Privé'),
        type_media: data.categorie === 'Média audio' ? !!data.type_media && typesMedia.some(t => t.nom_fr_type_media === data.type_media && t.categorie === 'Média audio') :
          data.categorie === 'Média écrit et électronique' ? !!data.type_media && typesMedia.some(t => t.nom_fr_type_media === data.type_media && t.categorie === 'Média écrit et électronique') : true,
        tv: data.type_media === 'TV' ? !!data.tv && tvOptions.some(t => t.nom_fr === data.tv) : true,
        radio: data.type_media === 'Radio' ? !!data.radio && radioOptions.some(r => r.nom_fr === data.radio) : true,
        media: data.categorie === 'Média écrit et électronique' ? !!data.media && typesMedia.some(t => t.nom_fr_type_media === data.media && t.categorie === 'Média écrit et électronique') : true,
        specialite: (data.type_media === 'TV' || data.categorie === 'Média écrit et électronique') ? !!data.specialite && specialites.some(s => s.name_fr === data.specialite) : true,
      };
      console.log('🔍 [isFormComplete] Résultats des checks publics :', publicChecks);
      const isComplete = Object.values({ ...baseChecks, ...publicChecks }).every(Boolean);
      console.log('✅ [isFormComplete] Formulaire complet ? :', isComplete);
      return isComplete;
    }
    if (data.secteur_travail === 'Privé') {
      const priveChecks = {
        categorie: data.categorie === 'Privé',
        type_media: data.type_media === 'Privé',
        langue: !!data.langue && langues.some(l => l.nom_fr === data.langue),
        specialite: !!data.specialite && specialites.some(s => s.name_fr === data.specialite),
      };
      console.log('🔍 [isFormComplete] Résultats des checks privés :', priveChecks);
      const isComplete = Object.values({ ...baseChecks, ...priveChecks }).every(Boolean);
      console.log('✅ [isFormComplete] Formulaire complet ? :', isComplete);
      return isComplete;
    }
    console.log('🚫 [isFormComplete] Secteur de travail invalide, formulaire incomplet');
    return false;
  }, [data, t]);

  // Valide les erreurs du formulaire (déplacé en haut)
  const validateFormErrors = useCallback(() => {
    console.log('🔍 [validateFormErrors] Début de la validation des erreurs');
    const errors = {};
    if (!data.id_professional_card) errors.id_professional_card = t.required.replace(':attribute', t.id_professional_card);
    if (!data.num_attes) errors.num_attes = t.required.replace(':attribute', t.num_attes);
    if (!data.fonction_fr) errors.fonction_fr = t.required.replace(':attribute', t.fonction_fr);
    if (!data.fonction_ar) errors.fonction_ar = t.required.replace(':attribute', t.fonction_ar);
    if (!data.secteur_travail || !secteurs.some(s => s.nom_fr_sect === data.secteur_travail)) {
      errors.secteur_travail = t.required.replace(':attribute', t.secteur_travail);
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = t.email_invalid;
    if (!data.tel || !/^(\+?\d{8,15})$/.test(data.tel)) errors.tel = t.phone_invalid;
    if (!data.attestation_travail && !(data.fichiers && data.fichiers.some((f) => f.type === 'attestation_travail'))) {
      errors.attestation_travail = t.required.replace(':attribute', t.attestation_travail);
    }
    if (!data.nom_etablissement) errors.nom_etablissement = t.required.replace(':attribute', t.nom_etablissement);
    if (!data.nom_etablissement_ar) errors.nom_etablissement_ar = t.required.replace(':attribute', t.nom_etablissement_ar);
    if (data.secteur_travail === 'Public') {
      if (!data.categorie || !categories.some(c => c.nom_fr_etat === data.categorie && c.nom_fr_etat !== 'Privé')) {
        errors.categorie = t.invalid_category;
      }
      if (data.categorie === 'Média audio' && (!data.type_media || !typesMedia.some(t => t.nom_fr_type_media === data.type_media && t.categorie === 'Média audio'))) {
        errors.type_media = t.invalid_media_type;
      }
      if (data.type_media === 'TV' && (!data.tv || !tvOptions.some(t => t.nom_fr === data.tv))) {
        errors.tv = t.invalid_tv_type;
      }
      if (data.type_media === 'Radio' && (!data.radio || !radioOptions.some(r => r.nom_fr === data.radio))) {
        errors.radio = t.invalid_radio_type;
      }
      if (data.categorie === 'Média écrit et électronique' && (!data.media || !typesMedia.some(t => t.nom_fr_type_media === data.media && t.categorie === 'Média écrit et électronique'))) {
        errors.media = t.invalid_written_media_type;
      }
      if ((data.type_media === 'TV' || data.categorie === 'Média écrit et électronique') && (!data.specialite || !specialites.some(s => s.name_fr === data.specialite))) {
        errors.specialite = t.required.replace(':attribute', t.specialite);
      }
    }
    if (data.secteur_travail === 'Privé') {
      if (data.categorie !== 'Privé') errors.categorie = t.invalid_category_private;
      if (data.type_media !== 'Privé') errors.type_media = t.invalid_media_type_private;
      if (!data.langue || !langues.some(l => l.nom_fr === data.langue)) {
        errors.langue = t.required.replace(':attribute', t.langue);
      }
      if (!data.specialite || !specialites.some(s => s.name_fr === data.specialite)) {
        errors.specialite = t.required.replace(':attribute', t.specialite);
      }
    }
    console.log('🔍 [validateFormErrors] Erreurs détectées :', errors);
    setFormErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    console.log('✅ [validateFormErrors] Formulaire valide ? :', isValid);
    return isValid;
  }, [data, t]);

  // Débogage avec useEffect : Loguer les changements dans 'data'
  useEffect(() => {
    console.log('🔄 [useEffect] État actuel de data mis à jour :', data);
  }, [data]);

  // Débogage avec useEffect : Loguer les erreurs du formulaire
  useEffect(() => {
    console.log('🚫 [useEffect] Erreurs actuelles du formulaire (formErrors) :', formErrors);
  }, [formErrors]);

  // Débogage avec useEffect : Loguer si le formulaire est complet
  useEffect(() => {
    console.log('✅ [useEffect] Statut du formulaire complet ? :', isFormComplete());
  }, [data, isFormComplete]);

  // Gère la soumission du formulaire (déplacé avant le return)
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📤 [handleSubmit] Soumission de Step2 déclenchée avec data :', { data });
    const professionalCardValid = await validateProfessionalCard(data.id_professional_card);
    if (!professionalCardValid) {
      console.error('❌ [handleSubmit] Carte professionnelle invalide.');
      return;
    }
    if (!validateFormErrors()) {
      console.error('❌ [handleSubmit] Formulaire incomplet, vérifiez les champs.');
      return;
    }
    console.log('✅ [handleSubmit] Formulaire valide, passage à l\'étape suivante.');
    onNext();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-6 w-full max-w-5xl bg-white shadow-md rounded-lg p-8 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
    >
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
      {numAttesError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {numAttesError}
        </div>
      )}
      {Object.keys(formErrors).length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <ul>
            {Object.values(formErrors).map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">{t.id_professional_card}</label>
          <input
            name="id_professional_card"
            value={data.id_professional_card || ''}
            onChange={handleProfessionalCardChange}
            onKeyPress={(e) => {
              const charCode = e.charCode;
              // Autoriser uniquement les chiffres (charCode entre 48 et 57 correspond à 0-9)
              if (charCode < 48 || charCode > 57) {
                e.preventDefault();
              }
            }}
            placeholder={t.id_professional_card}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${isProfessionalCardDisabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
            required
          />
          {formErrors.id_professional_card && <p className="text-red-500 text-sm">{formErrors.id_professional_card}</p>}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">{t.num_attes}</label>
          <input
            name="num_attes"
            value={data.num_attes || ''}
            //onChange={onChange}
            onChange={handleNumAttesChange}
            onBlur={handleNumAttesBlur}
            onKeyDown={handleNumAttesKeyDown}
            ref={numAttesInputRef}
            placeholder={t.num_attes}
            disabled={isNumAttesDisabled}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
            required
          />
          {formErrors.num_attes && <p className="text-red-500 text-sm">{formErrors.num_attes}</p>}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">{t.fonction_fr}</label>
          <input
            name="fonction_fr"
            value={data.fonction_fr || ''}
            onChange={onChange}
            placeholder={t.fonction_fr}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
          {formErrors.fonction_fr && <p className="text-red-500 text-sm">{formErrors.fonction_fr}</p>}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">{t.fonction_ar}</label>
          <input
            name="fonction_ar"
            value={data.fonction_ar || ''}
            onChange={onChange}
            placeholder={t.fonction_ar}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-right`}
            required
          />
          {formErrors.fonction_ar && <p className="text-red-500 text-sm">{formErrors.fonction_ar}</p>}
        </div>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">{t.secteur_travail}</label>
        <select
          name="secteur_travail"
          value={data.secteur_travail || ''}
          onChange={handleSecteurChange}
          className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
          required
        >
          <option value="">{t.secteur_travail}</option>
          {secteurs.map((s, index) => (
            <option key={index} value={s.nom_fr_sect}>
              {interfaceLocale === 'ar' ? s.nom_ar_sect : s.nom_fr_sect}
            </option>
          ))}
        </select>
        {formErrors.secteur_travail && <p className="text-red-500 text-sm">{formErrors.secteur_travail}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.secteur_travail === 'Public' && (
          <>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">{t.categorie}</label>
              <select
                name="categorie"
                value={data.categorie || ''}
                onChange={handleCategorieChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
                required
              >
                <option value="">{t.categorie}</option>
                {categories.filter(c => c.id_sect === 2).map((c, index) => (
                  <option key={index} value={c.nom_fr_etat}>
                    {interfaceLocale === 'ar' ? c.nom_ar_etat : c.nom_fr_etat}
                  </option>
                ))}
              </select>
              {formErrors.categorie && <p className="text-red-500 text-sm">{formErrors.categorie}</p>}
            </div>
            {data.categorie === 'Média audio' && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">{t.type_media}</label>
                <select
                  name="type_media"
                  value={data.type_media || ''}
                  onChange={handleTypeMediaChange}
                  className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
                  required
                >
                  <option value="">{t.type_media}</option>
                  {typesMedia.filter(t => t.categorie === 'Média audio').map((t, index) => (
                    <option key={index} value={t.nom_fr_type_media}>
                      {interfaceLocale === 'ar' ? t.nom_ar_type_media : t.nom_fr_type_media}
                    </option>
                  ))}
                </select>
                {formErrors.type_media && <p className="text-red-500 text-sm">{formErrors.type_media}</p>}
              </div>
            )}
            {data.categorie === 'Média audio' && data.type_media === 'TV' && (
              <>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">{t.tv}</label>
                  <select
                    name="tv"
                    value={data.tv || ''}
                    onChange={onChange}
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
                    required
                  >
                    <option value="">{t.tv}</option>
                    {tvOptions.map((option, index) => (
                      <option key={index} value={option.nom_fr}>
                        {interfaceLocale === 'ar' ? option.nom_ar : option.nom_fr}
                      </option>
                    ))}
                  </select>
                  {formErrors.tv && <p className="text-red-500 text-sm">{formErrors.tv}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">{t.specialite}</label>
                  <select
                    name="specialite"
                    value={data.specialite || ''}
                    onChange={onChange}
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
                    required={(data.secteur_travail === 'Privé') || (data.secteur_travail === 'Public' && (data.type_media === 'TV' || data.categorie === 'Média écrit et électronique'))}
                  >
                    <option value="">{t.specialite}</option>
                    {specialites.map((s, index) => (
                      <option key={index} value={s.name_fr}>
                        {interfaceLocale === 'ar' ? s.name_ar : s.name_fr}
                      </option>
                    ))}
                  </select>
                  {formErrors.specialite && <p className="text-red-500 text-sm">{formErrors.specialite}</p>}
                </div>
              </>
            )}
            {data.categorie === 'Média audio' && data.type_media === 'Radio' && (
              <>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">{t.radio}</label>
                  <select
                    name="radio"
                    value={data.radio || ''}
                    onChange={onChange}
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
                    required
                  >
                    <option value="">{t.radio}</option>
                    {radioOptions.map((option, index) => (
                      <option key={index} value={option.nom_fr}>
                        {interfaceLocale === 'ar' ? option.nom_ar : option.nom_fr}
                      </option>
                    ))}
                  </select>
                  {formErrors.radio && <p className="text-red-500 text-sm">{formErrors.radio}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">{t.specialite}</label>
                  <select
                    name="specialite"
                    value={data.specialite || ''}
                    onChange={onChange}
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
                    required={(data.secteur_travail === 'Privé') || (data.secteur_travail === 'Public' && (data.type_media === 'TV' || data.categorie === 'Média écrit et électronique'))}
                  >
                    <option value="">{t.specialite}</option>
                    {specialites.map((s, index) => (
                      <option key={index} value={s.name_fr}>
                        {interfaceLocale === 'ar' ? s.name_ar : s.name_fr}
                      </option>
                    ))}
                  </select>
                  {formErrors.specialite && <p className="text-red-500 text-sm">{formErrors.specialite}</p>}
                </div>
              </>
            )}
            {data.categorie === 'Média écrit et électronique' && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">{t.media}</label>
                <select
                  name="media"
                  value={data.media || ''}
                  onChange={handleMediaChange}
                  className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
                  required
                >
                  <option value="">{t.media}</option>
                  {typesMedia.filter(t => t.categorie === 'Média écrit et électronique').map((t, index) => (
                    <option key={index} value={t.nom_fr_type_media}>
                      {interfaceLocale === 'ar' ? t.nom_ar_type_media : t.nom_fr_type_media}
                    </option>
                  ))}
                </select>
                {formErrors.media && <p className="text-red-500 text-sm">{formErrors.media}</p>}
              </div>
            )}
          </>
        )}
        {data.secteur_travail === 'Privé' && (
          <>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">{t.langue}</label>
              <select
                name="langue"
                value={data.langue || ''}
                onChange={onChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
                required
              >
                <option value="">{t.langue}</option>
                {langues.map((l, index) => (
                  <option key={index} value={l.nom_fr}>
                    {interfaceLocale === 'ar' ? l.nom_ar : l.nom_fr}
                  </option>
                ))}
              </select>
              {formErrors.langue && <p className="text-red-500 text-sm">{formErrors.langue}</p>}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">{t.specialite}</label>
              <select
                name="specialite"
                value={data.specialite || ''}
                onChange={onChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
                required={(data.secteur_travail === 'Privé') || (data.secteur_travail === 'Public' && (data.type_media === 'TV' || data.categorie === 'Média écrit et électronique'))}
              >
                <option value="">{t.specialite}</option>
                {specialites.map((s, index) => (
                  <option key={index} value={s.name_fr}>
                    {interfaceLocale === 'ar' ? s.name_ar : s.name_fr}
                  </option>
                ))}
              </select>
              {formErrors.specialite && <p className="text-red-500 text-sm">{formErrors.specialite}</p>}
            </div>
          </>
        )}
      </div>

      {data.categorie === 'Média écrit et électronique' && (
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">{t.specialite}</label>
          <select
            name="specialite"
            value={data.specialite || ''}
            onChange={onChange}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
            required={(data.secteur_travail === 'Privé') || (data.secteur_travail === 'Public' && (data.type_media === 'TV' || data.categorie === 'Média écrit et électronique'))}
          >
            <option value="">{t.specialite}</option>
            {specialites.map((s, index) => (
              <option key={index} value={s.name_fr}>
                {interfaceLocale === 'ar' ? s.name_ar : s.name_fr}
              </option>
            ))}
          </select>
          {formErrors.specialite && <p className="text-red-500 text-sm">{formErrors.specialite}</p>}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">{t.nom_etablissement}</label>
          <input
            name="nom_etablissement"
            value={data.nom_etablissement || ''}
            onChange={onChange}
            placeholder={t.nom_etablissement}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
          {formErrors.nom_etablissement && <p className="text-red-500 text-sm">{formErrors.nom_etablissement}</p>}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">{t.nom_etablissement_ar}</label>
          <input
            name="nom_etablissement_ar"
            value={data.nom_etablissement_ar || ''}
            onChange={onChange}
            placeholder={t.nom_etablissement_ar}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-right`}
            required
          />
          {formErrors.nom_etablissement_ar && <p className="text-red-500 text-sm">{formErrors.nom_etablissement_ar}</p>}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">{t.email}</label>
          <input
            name="email"
            value={data.email || ''}
            onChange={onChange}
            placeholder={t.email}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
          {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">{t.tel}</label>
          <input
            name="tel"
            value={data.tel || ''}
            onChange={onChange}
            placeholder={t.tel}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
          {formErrors.tel && <p className="text-red-500 text-sm">{formErrors.tel}</p>}
        </div>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="attestation_travail">
          {t.attestation_travail}
        </label>
        {data.fichiers && data.fichiers.some((f) => f.type === 'attestation_travail') && (
          <div className="mb-2">
            <p className="text-sm text-gray-600">
              {interfaceLocale === 'fr' ? 'Fichier existant :' : 'الملف الموجود :'}
              {data.fichiers.find((f) => f.type === 'attestation_travail').nom_fichier_fr}{' '}
              <a
                href={`http://localhost:8000/storage/${data.fichiers.find((f) => f.type === 'attestation_travail').file_path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {interfaceLocale === 'fr' ? '(Voir)' : '(عرض)'}
              </a>
            </p>
          </div>
        )}
        <label className={`relative inline-block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus-within:ring-blue-500 focus-within:border-blue-500 w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}>
          <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
            {interfaceLocale === 'fr' ? 'Sélectionner un fichier' : 'اختر ملفًا'}
          </span>
          <input
            type="file"
            name="attestation_travail"
            onChange={handleFileChange}
            accept="application/pdf"
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            //className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required={!data.fichiers || !data.fichiers.some((f) => f.type === 'attestation_travail')}
          />
        </label>
        {selectedFileName && (
          <p className={`text-sm text-gray-600 mt-2 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}>
            {interfaceLocale === 'fr' ? 'Fichier sélectionné :' : 'الملف المختار :'} {selectedFileName}
          </p>
        )}
        {formErrors.attestation_travail && <p className="text-red-500 text-sm">{formErrors.attestation_travail}</p>}
      </div>
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          {t.prev_step}
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isFormComplete() || !!professionalCardError || !!numAttesError}
        >
          {t.next_step}
        </button>
      </div>
    </form>
  );
}