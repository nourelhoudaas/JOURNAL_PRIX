import React, { useCallback, useState, useEffect, useRef } from "react";

export default function Step2({
  data,
  onChange,
  onFileChange,
  onNext,
  onBack,
  error,
  setIsProfessionalCardValidated,
  interfaceLocale,
  t,
}) {
  const [professionalCardError, setProfessionalCardError] = useState("");
  const [professionalCardExistsMessage, setProfessionalCardExistsMessage] =
    useState("");
  const [isProfessionalCardDisabled, setIsProfessionalCardDisabled] =
    useState(false);
  const [attestationNumberError, setAttestationNumberError] = useState("");
  const [attestationNumberExistsMessage, setAttestationNumberExistsMessage] = useState("");
  const [isAttestationNumberDisabled, setIsAttestationNumberDisabled] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const debounceTimer = useRef(null);
  const [selectedAttestationTravail, setSelectedAttestationTravail] = useState(null);
  const [selectedCarteProfessionnelle, setSelectedCarteProfessionnelle] = useState(null);

  const secteurs = [
    { nom_fr_sect: "Public", nom_ar_sect: "عام" },
    { nom_fr_sect: "Privé", nom_ar_sect: "خاص" },
  ];

  const categories = [
    { nom_fr_etat: "Média audio", nom_ar_etat: "وسائط صوتية", id_sect: 2 },
    {
      nom_fr_etat: "Média écrit et électronique",
      nom_ar_etat: "وسائط مكتوبة و إلكترونية",
      id_sect: 2,
    },
    { nom_fr_etat: "Privé", nom_ar_etat: "خاص", id_sect: 1 },
  ];

  const typesMedia = [
    {
      nom_fr_type_media: "TV",
      nom_ar_type_media: "تلفزيون",
      categorie: "Média audio",
    },
    {
      nom_fr_type_media: "Radio",
      nom_ar_type_media: "راديو",
      categorie: "Média audio",
    },
    {
      nom_fr_type_media: "Écrit",
      nom_ar_type_media: "مكتوب",
      categorie: "Média écrit et électronique",
    },
    {
      nom_fr_type_media: "Électronique",
      nom_ar_type_media: "إلكتروني",
      categorie: "Média écrit et électronique",
    },
    {
      nom_fr_type_media: "Privé",
      nom_ar_type_media: "خاص",
      categorie: "Privé",
    },
  ];

  const specialites = [
    { name_fr: "Culturel", name_ar: "ثقافي" },
    { name_fr: "Economique", name_ar: "إقتصادي" },
    { name_fr: "Publique", name_ar: "عام" },
    { name_fr: "Sport", name_ar: "رياضي" },
    { name_fr: "Santé", name_ar: "صحي" },
    { name_fr: "Touristique", name_ar: "سياحي" },
    { name_fr: "Agricole", name_ar: "فلاحي" },
    { name_fr: "Technologique", name_ar: "تكنولوجي" },
    { name_fr: "Automobile", name_ar: "سيارات" },
  ];

  const langues = [
    { nom_fr: "Arabe", nom_ar: "عربي" },
    { nom_fr: "Français", nom_ar: "فرنسي" },
  ];

  const tvOptions = [
    { nom_fr: "Régionale", nom_ar: "إقليمي" },
    { nom_fr: "Nationale", nom_ar: "وطني" },
  ];

  const radioOptions = [
    { nom_fr: "Publique", nom_ar: "عمومي" },
    { nom_fr: "Locale", nom_ar: "محلي" },
  ];

  const getLabel = (fieldName, labelText) => {
    const requiredFields = [
      "id_professional_card",
      "num_attes",
      "fonction_fr",
      "fonction_ar",
      "secteur_travail",
      "type_media",
      "nom_etablissement",
      "nom_etablissement_ar",
      "email",
      "specialite",
      "langue",
      "media",
      "tv",
      "radio",
      "categorie",
      "attestation_travail",
      "carte_professionnelle",
    ];
    const conditionalRequired = {
      categorie: data.secteur_travail === "Public",
    };

    if (requiredFields.includes(fieldName) || conditionalRequired[fieldName]) {
      return (
        <>
          {labelText} <span className="text-red-500">*</span>
        </>
      );
    }
    return (
      <>
        {labelText}{" "}
        <span className="text-gray-500">
          {interfaceLocale === "fr" ? "(facultatif)" : "(اختياري)"}
        </span>
      </>
    );
  };


  // Fonction pour prévisualiser un fichier
  const handlePreviewFile = (file) => {
    if (file && file instanceof File) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");
      setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
    } else {
      console.error("Fichier non valide pour la prévisualisation:", file);
    }
  };

  // Fonctions pour supprimer les fichiers
  const handleRemoveAttestationTravail = () => {
    setSelectedAttestationTravail(null);
    onChange({ target: { name: "attestation_travail", value: null } });
  };

  const handleRemoveCarteProfessionnelle = () => {
    setSelectedCarteProfessionnelle(null);
    onChange({ target: { name: "carte_professionnelle", value: null } });
  };

  const validateProfessionalCard = useCallback(
    async (value) => {
      console.log(
        "🔍 [validateProfessionalCard] Début de la validation pour value :",
        value
      );
      if (!value) {
        console.log("🚫 [validateProfessionalCard] id_professional_card vide");
        setProfessionalCardError(
          t.required.replace(":attribute", t.id_professional_card)
        );
        setProfessionalCardExistsMessage("");
        return false;
      }

      try {
        console.log(
          "🔍 [validateProfessionalCard] Vérification de la carte professionnelle:",
          { id_professional_card: value, userId: data.userId, interfaceLocale }
        );
        const response = await fetch(
          `http://localhost:8000/check-professional-card?id_professional_card=${value}&userId=${data.userId || ""
          }&locale=${interfaceLocale}`,
          { headers: { Accept: "application/json" } }
        );
        const result = await response.json();
        console.log(
          "📥 [validateProfessionalCard] Réponse de checkProfessionalCard:",
          result
        );

        if (response.ok) {
          if (result.exists && result.data) {
            const categorieValue =
              result.data.secteur_travail === "Privé"
                ? "Privé"
                : result.data.categorie && result.data.categorie !== "unknown"
                  ? result.data.categorie
                  : "";
            const typeMediaValue =
              result.data.secteur_travail === "Privé"
                ? "Privé"
                : result.data.type_media && result.data.type_media !== ""
                  ? result.data.type_media
                  : "";
            const radioValue = result.data.radio || "";
            const specialiteValue = result.data.specialite || "";

            console.log(
              "✅ [validateProfessionalCard] Données reçues pour mise à jour",
              {
                categorie: categorieValue,
                type_media: typeMediaValue,
                radio: radioValue,
                specialite: specialiteValue,
              }
            );

            setProfessionalCardExistsMessage(t.professional_card_found);
            setIsProfessionalCardDisabled(true);
            setProfessionalCardError("");
            setIsProfessionalCardValidated(true);
            onChange({
              target: {
                name: "batch",
                value: {
                  ...result.data,
                  categorie: categorieValue,
                  type_media: typeMediaValue,
                  radio: radioValue,
                  specialite: specialiteValue,
                },
              },
            });

            if (!categorieValue && result.data.secteur_travail === "Public") {
              console.log(
                "🚫 [validateProfessionalCard] Catégorie non définie pour secteur public"
              );
              setProfessionalCardError(t.invalid_category);
              setIsProfessionalCardDisabled(false);
              setIsProfessionalCardValidated(false);
            }

            if (
              !typeMediaValue &&
              result.data.secteur_travail === "Public" &&
              categorieValue === "Média audio"
            ) {
              console.log(
                "🚫 [validateProfessionalCard] Type média non défini pour Média audio"
              );
              setProfessionalCardError(t.invalid_media_type);
              setIsProfessionalCardDisabled(false);
              setIsProfessionalCardValidated(false);
            }

            console.log("✅ [validateProfessionalCard] Validation réussie");
            return true;
          } else if (result.exists) {
            console.log(
              "🚫 [validateProfessionalCard] Carte professionnelle déjà utilisée par un autre utilisateur"
            );
            setProfessionalCardError(
              result.error || t.professional_card_exists
            );
            setProfessionalCardExistsMessage("");
            setIsProfessionalCardDisabled(false);
            setIsProfessionalCardValidated(false);
            return false;
          } else {
            console.log(
              "🔎 [validateProfessionalCard] Nouvelle carte professionnelle détectée"
            );
            setProfessionalCardError("");
            setIsProfessionalCardDisabled(false);
            setIsProfessionalCardValidated(false);
            onChange({
              target: {
                name: "batch",
                value: {
                  id_professional_card: value,
                  num_attes: "",
                  fonction_fr: "",
                  fonction_ar: "",
                  secteur_travail: "",
                  categorie: "",
                  type_media: "",
                  tv: "",
                  radio: "",
                  media: "",
                  langue: "",
                  specialite: "",
                  nom_etablissement: "",
                  nom_etablissement_ar: "",
                  email: "",
                  tel: "",
                  attestation_travail: null,
                  carte_professionnelle: null,
                  fichiers: [],
                },
              },
            });
            return true;
          }
        } else {
          console.log(
            "🚫 [validateProfessionalCard] Erreur serveur lors de la vérification",
            { message: result.message }
          );
          setProfessionalCardError(
            result.message || t.professional_card_exists
          );
          setProfessionalCardExistsMessage("");
          setIsProfessionalCardValidated(false);
          return false;
        }
      } catch (error) {
        console.error(
          "❌ [validateProfessionalCard] Erreur lors de la vérification de la carte professionnelle:",
          error
        );
        setProfessionalCardError(t.error_check_professional_card);
        setProfessionalCardExistsMessage("");
        setIsProfessionalCardValidated(false);
        return false;
      }
    },
    [data.userId, onChange, setIsProfessionalCardValidated, interfaceLocale, t]
  );

  // Validation du numéro d'attestation avec gestion des états
  const validateAttestationNumber = useCallback(
    async (value) => {
      console.log("🔍 [validateAttestationNumber] Début de la validation pour num_attes :", value);
      if (!value) {
        console.log("🚫 [validateAttestationNumber] num_attes vide");
        setAttestationNumberError(t.required.replace(":attribute", t.num_attes));
        setAttestationNumberExistsMessage("");
        return false;
      }

      try {
        console.log("🔍 [validateAttestationNumber] Vérification du numéro d'attestation:", {
          num_attes: value,
          userId: data.userId,
          interfaceLocale,
        });
        const response = await fetch(
          `http://localhost:8000/check-attestation-number?num_attes=${value}&userId=${data.userId || ""}&locale=${interfaceLocale}`,
          { headers: { Accept: "application/json" } }
        );
        const result = await response.json();
        console.log("📥 [validateAttestationNumber] Réponse de checkAttestationNumber:", result);

        if (response.ok) {
          if (result.exists && result.error) {
            console.log("🚫 [validateAttestationNumber] Numéro d'attestation déjà utilisé par un autre utilisateur");
            setAttestationNumberError(result.error || t.attestation_number_exists);
            setAttestationNumberExistsMessage("");
            setIsAttestationNumberDisabled(false);
            return false;
          } else if (result.exists) {
            console.log("✅ [validateAttestationNumber] Numéro d'attestation trouvé pour l'utilisateur actuel");
            setAttestationNumberExistsMessage(t.attestation_number_found);
            setAttestationNumberError("");
            setIsAttestationNumberDisabled(true);
            // Pas de mise à jour des données ici, car checkProfessionalCard s'en charge
            return true;
          } else {
            console.log("🔎 [validateAttestationNumber] Nouveau numéro d'attestation détecté");
            setAttestationNumberError("");
            setAttestationNumberExistsMessage(t.attestation_number_not_found);
            setIsAttestationNumberDisabled(false);
            // Réinitialiser uniquement num_attes, sans affecter les autres champs
            onChange({
              target: {
                name: "num_attes",
                value: value,
              },
            });
            return true;
          }
        } else {
          console.log("🚫 [validateAttestationNumber] Erreur serveur lors de la vérification", { message: result.message });
          setAttestationNumberError(result.message || t.attestation_number_exists);
          setAttestationNumberExistsMessage("");
          setIsAttestationNumberDisabled(false);
          return false;
        }
      } catch (error) {
        console.error("❌ [validateAttestationNumber] Erreur lors de la vérification du numéro d'attestation:", error);
        setAttestationNumberError(t.error_check_attestation_number || "Erreur lors de la vérification du numéro d'attestation.");
        setAttestationNumberExistsMessage("");
        setIsAttestationNumberDisabled(false);
        return false;
      }
    },
    [data.userId, onChange, interfaceLocale, t]
  );

  // Gestion du changement avec debounce pour num_attes
  const handleAttestationNumberChange = useCallback(
    (e) => {
      const { value } = e.target;
      console.log("🔄 [handleAttestationNumberChange] Changement détecté pour num_attes :", value);
      if (value === data.num_attes) return;
      onChange(e);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(async () => {
        await validateAttestationNumber(value);
      }, 500);
    },
    [data.num_attes, onChange, validateAttestationNumber]
  );

  const handleProfessionalCardChange = useCallback(
    (e) => {
      const { value } = e.target;
      console.log(
        "🔄 [handleProfessionalCardChange] Changement détecté pour value :",
        value
      );
      if (value === data.id_professional_card) return;
      onChange(e);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(async () => {
        await validateProfessionalCard(value);
      }, 500);
    },
    [data.id_professional_card, onChange, validateProfessionalCard]
  );

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleTypeMediaChange = (e) => {
    const { value } = e.target;
    console.log("🔄 [handleTypeMediaChange] Changement de type_media:", value);
    onChange({
      target: {
        name: "type_media",
        value,
      },
    });
    if (value !== "TV") {
      onChange({ target: { name: "tv", value: "" } });
    }
    if (value !== "Radio") {
      onChange({ target: { name: "radio", value: "" } });
    }
  };

  const handleMediaChange = (e) => {
    const { value } = e.target;
    console.log("🔄 [handleMediaChange] Changement de media:", value);
    onChange({
      target: {
        name: "media",
        value,
      },
    });
    if (data.categorie === "Média écrit et électronique") {
      onChange({
        target: {
          name: "type_media",
          value: value,
        },
      });
    }
  };

  const handleCategorieChange = (e) => {
    const { value } = e.target;
    console.log("🔄 [handleCategorieChange] Changement de categorie:", value);
    onChange({
      target: {
        name: "categorie",
        value,
      },
    });
    if (value !== "Média audio") {
      onChange({ target: { name: "type_media", value: "" } });
      onChange({ target: { name: "tv", value: "" } });
      onChange({ target: { name: "radio", value: "" } });
    }
    if (value !== "Média écrit et électronique") {
      onChange({ target: { name: "media", value: "" } });
    } else {
      onChange({ target: { name: "type_media", value: data.media || "" } });
    }
    if (value !== "Média écrit et électronique" && data.type_media !== "TV") {
      onChange({ target: { name: "specialite", value: "" } });
    }
  };

  const handleSecteurChange = (e) => {
    const { value } = e.target;
    console.log("🔄 [handleSecteurChange] Changement de secteur_travail:", {
      value,
    });
    onChange({
      target: {
        name: "secteur_travail",
        value,
      },
    });
    if (value === "Privé") {
      onChange({ target: { name: "categorie", value: "Privé" } });
      onChange({ target: { name: "type_media", value: "Privé" } });
      onChange({ target: { name: "tv", value: "" } });
      onChange({ target: { name: "radio", value: "" } });
      onChange({ target: { name: "media", value: "" } });
      onChange({ target: { name: "langue", value: "" } });
    } else {
      onChange({ target: { name: "categorie", value: "" } });
      onChange({ target: { name: "type_media", value: "" } });
      onChange({ target: { name: "tv", value: "" } });
      onChange({ target: { name: "radio", value: "" } });
      onChange({ target: { name: "media", value: "" } });
      onChange({ target: { name: "langue", value: "" } });
      onChange({ target: { name: "specialite", value: "" } });
    }
  };

  // Fonction utilitaire pour tronquer les noms de fichiers longs (optionnel pour l'affichage)
  const truncateFileName = (name, maxLength = 50) => {
    if (name.length <= maxLength) return name;
    const extension = name.split('.').pop();
    const baseName = name.slice(0, name.lastIndexOf('.'));
    return `${baseName.slice(0, maxLength - 10 - extension.length)}...${baseName.slice(-5)}.${extension}`;
  };

  // Gestion du changement de fichier
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const maxSizeAttestation = 10 * 1024 * 1024; // 10 Mo pour attestation_travail
    const maxSizeCarteProfessionnelle = 2 * 1024 * 1024; // 2 Mo pour carte_professionnelle
    const maxNameLength = 100; // Limite pour le nom du fichier

    if (files.length > 0) {
      const file = files[0];

      // Vérification de la longueur du nom
      if (file.name.length > maxNameLength) {
        setFormErrors((prev) => ({
          ...prev,
          [name]:
            t.file_name_too_long?.replace(":max", maxNameLength) ||
            (interfaceLocale === "fr"
              ? `Nom du fichier trop long (maximum ${maxNameLength} caractères). Veuillez renommer le fichier.`
              : `اسم الملف طويل جدًا (حد أقصى ${maxNameLength} حرف). يرجى إعادة تسمية الملف.`),
        }));
        if (name === "attestation_travail") setSelectedAttestationTravail(null);
        else if (name === "carte_professionnelle") setSelectedCarteProfessionnelle(null);
        return;
      }

      // Vérification de la taille
      if (name === "attestation_travail" && file.size > maxSizeAttestation) {
        setFormErrors((prev) => ({
          ...prev,
          attestation_travail:
            t.max_file_size?.replace(":attribute", t.attestation_travail)?.replace(":max", "10 Mo") ||
            (interfaceLocale === "fr"
              ? "La taille de l'attestation de travail ne doit pas dépasser 10 Mo."
              : "حجم شهادة العمل يجب ألا يتجاوز 10 ميغابايت."),
        }));
        setSelectedAttestationTravail(null);
        return;
      }

      if (name === "carte_professionnelle" && file.size > maxSizeCarteProfessionnelle) {
        setFormErrors((prev) => ({
          ...prev,
          carte_professionnelle:
            t.max_file_size?.replace(":attribute", t.carte_professionnelle)?.replace(":max", "2 Mo") ||
            (interfaceLocale === "fr"
              ? "La taille de la carte professionnelle ne doit pas dépasser 2 Mo."
              : "حجم البطاقة المهنية يجب ألا يتجاوز 2 ميغابايت."),
        }));
        setSelectedCarteProfessionnelle(null);
        return;
      }

      // Effacer l'erreur si le fichier est valide
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));

      // Mettre à jour l'état du fichier
      if (name === "attestation_travail") {
        setSelectedAttestationTravail(file);
      } else if (name === "carte_professionnelle") {
        setSelectedCarteProfessionnelle(file);
      }

      onFileChange(e);
    } else {
      if (name === "attestation_travail") setSelectedAttestationTravail(null);
      else if (name === "carte_professionnelle") setSelectedCarteProfessionnelle(null);
    }
  };


  // Valider le numéro de téléphone
  const validatePhoneNumber = (value) => {
    if (value && (value.length !== 10 || !/^[0-9]{10}$/.test(value))) {
      return (
        t.phone_invalid ||
        "Le numéro de téléphone doit contenir exactement 10 chiffres."
      );
    }
    return "";
  };

  // Gérer la perte de focus sur le champ num_tlf_personne
  const handlePhoneBlur = (e) => {
    const { value } = e.target;
    const phoneError = validatePhoneNumber(value);
    setFormErrors((prev) => ({
      ...prev,
      tel: phoneError,
    }));
  };

  // Gérer le changement dans le champ num_tlf_personne
  const handlePhoneChange = (e) => {
    const { value } = e.target;
    onChange(e); // Mettre à jour data.tel
    const phoneError = validatePhoneNumber(value);
    setFormErrors((prev) => ({
      ...prev,
      tel: phoneError,
    }));
  };

  // Valider l'adresse e-mail
  const validateEmail = (value) => {
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return t.email_invalid || "Veuillez entrer une adresse e-mail valide.";
    }
    return "";
  };

  // Gérer la perte de focus sur le champ email
  const handleEmailBlur = (e) => {
    const { value } = e.target;
    const emailError = validateEmail(value);
    setFormErrors((prev) => ({
      ...prev,
      email: emailError,
    }));
  };

  const isFormComplete = useCallback(() => {
    console.log(
      "🔍 [isFormComplete] Début de la vérification du formulaire complet"
    );
    const baseChecks = {
      id_professional_card: !!data.id_professional_card,
      num_attes: !!data.num_attes,
      fonction_fr: !!data.fonction_fr,
      fonction_ar: !!data.fonction_ar,
      secteur_travail:
        !!data.secteur_travail &&
        secteurs.some((s) => s.nom_fr_sect === data.secteur_travail),
      email: !!data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email),
      attestation_travail:
        data.attestation_travail instanceof File ||
        (data.fichiers &&
          data.fichiers.some((f) => f.type === "attestation_travail")),
      carte_professionnelle:
        data.carte_professionnelle instanceof File ||
        (data.fichiers &&
          data.fichiers.some((f) => f.type === "carte_professionnelle")),
      nom_etablissement: !!data.nom_etablissement,
      nom_etablissement_ar: !!data.nom_etablissement_ar,
    };

    console.log(
      "🔍 [isFormComplete] Résultats des checks de base :",
      baseChecks
    );

    if (data.secteur_travail === "Public") {
      const publicChecks = {
        categorie:
          !!data.categorie &&
          categories.some(
            (c) => c.nom_fr_etat === data.categorie && c.nom_fr_etat !== "Privé"
          ),
        type_media:
          data.categorie === "Média audio"
            ? !!data.type_media &&
            typesMedia.some(
              (t) =>
                t.nom_fr_type_media === data.type_media &&
                t.categorie === "Média audio"
            )
            : data.categorie === "Média écrit et électronique"
              ? !!data.type_media &&
              typesMedia.some(
                (t) =>
                  t.nom_fr_type_media === data.type_media &&
                  t.categorie === "Média écrit et électronique"
              )
              : true,
        tv:
          data.type_media === "TV"
            ? !!data.tv && tvOptions.some((t) => t.nom_fr === data.tv)
            : true,
        radio:
          data.type_media === "Radio"
            ? !!data.radio && radioOptions.some((r) => r.nom_fr === data.radio)
            : true,
        media:
          data.categorie === "Média écrit et électronique"
            ? !!data.media &&
            typesMedia.some(
              (t) =>
                t.nom_fr_type_media === data.media &&
                t.categorie === "Média écrit et électronique"
            )
            : true,
        specialite:
          data.type_media === "TV" ||
            data.categorie === "Média écrit et électronique"
            ? !!data.specialite &&
            specialites.some((s) => s.name_fr === data.specialite)
            : true,
      };

      console.log(
        "🔍 [isFormComplete] Résultats des checks publics :",
        publicChecks
      );
      const isComplete = Object.values({
        ...baseChecks,
        ...publicChecks,
      }).every(Boolean);
      console.log("✅ [isFormComplete] Formulaire complet ? :", isComplete);
      return isComplete;
    }

    if (data.secteur_travail === "Privé") {
      const priveChecks = {
        categorie: data.categorie === "Privé",
        type_media: data.type_media === "Privé",
        langue: !!data.langue && langues.some((l) => l.nom_fr === data.langue),
        specialite:
          !!data.specialite &&
          specialites.some((s) => s.name_fr === data.specialite),
      };

      console.log(
        "🔍 [isFormComplete] Résultats des checks privés :",
        priveChecks
      );
      const isComplete = Object.values({ ...baseChecks, ...priveChecks }).every(
        Boolean
      );
      console.log("✅ [isFormComplete] Formulaire complet ? :", isComplete);
      return isComplete;
    }

    console.log(
      "🚫 [isFormComplete] Secteur de travail invalide, formulaire incomplet"
    );
    return false;
  }, [data, t]);

  const validateFormErrors = useCallback(() => {
    console.log("🔍 [validateFormErrors] Début de la validation des erreurs");
    const errors = {};
    if (!data.id_professional_card)
      errors.id_professional_card = t.required.replace(
        ":attribute",
        t.id_professional_card
      );
    if (!data.num_attes)
      errors.num_attes = t.required.replace(":attribute", t.num_attes);
    if (!data.fonction_fr)
      errors.fonction_fr = t.required.replace(":attribute", t.fonction_fr);
    if (!data.fonction_ar)
      errors.fonction_ar = t.required.replace(":attribute", t.fonction_ar);
    if (
      !data.secteur_travail ||
      !secteurs.some((s) => s.nom_fr_sect === data.secteur_travail)
    ) {
      errors.secteur_travail = t.required.replace(
        ":attribute",
        t.secteur_travail
      );
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errors.email = t.email_invalid;
    if (data.tel && (data.tel.length !== 10 || !/^[0-9]{10}$/.test(data.tel))) {
      errors.tel =
        t.phone_invalid ||
        "Le numéro de téléphone doit contenir exactement 10 chiffres.";
    }
    if (!data.attestation_travail && !(data.fichiers && data.fichiers.some((f) => f.type === "attestation_travail"))) {
      errors.attestation_travail = t.required.replace(
        ":attribute",
        t.attestation_travail
      );
    }
    if (!data.carte_professionnelle && !(data.fichiers && data.fichiers.some((f) => f.type === "carte_professionnelle"))) {
      errors.carte_professionnelle = t.required.replace(
        ":attribute",
        t.carte_professionnelle
      );
    }
    if (!data.nom_etablissement)
      errors.nom_etablissement = t.required.replace(
        ":attribute",
        t.nom_etablissement
      );
    if (!data.nom_etablissement_ar)
      errors.nom_etablissement_ar = t.required.replace(
        ":attribute",
        t.nom_etablissement_ar
      );

    if (data.secteur_travail === "Public") {
      if (
        !data.categorie ||
        !categories.some(
          (c) => c.nom_fr_etat === data.categorie && c.nom_fr_etat !== "Privé"
        )
      ) {
        errors.categorie = t.invalid_category;
      }
      if (
        data.categorie === "Média audio" &&
        (!data.type_media ||
          !typesMedia.some(
            (t) =>
              t.nom_fr_type_media === data.type_media &&
              t.categorie === "Média audio"
          ))
      ) {
        errors.type_media = t.invalid_media_type;
      }
      if (
        data.type_media === "TV" &&
        (!data.tv || !tvOptions.some((t) => t.nom_fr === data.tv))
      ) {
        errors.tv = t.invalid_tv_type;
      }
      if (
        data.type_media === "Radio" &&
        (!data.radio || !radioOptions.some((r) => r.nom_fr === data.radio))
      ) {
        errors.radio = t.invalid_radio_type;
      }
      if (
        data.categorie === "Média écrit et électronique" &&
        (!data.media ||
          !typesMedia.some(
            (t) =>
              t.nom_fr_type_media === data.media &&
              t.categorie === "Média écrit et électronique"
          ))
      ) {
        errors.media = t.invalid_written_media_type;
      }
      if (
        (data.type_media === "TV" ||
          data.categorie === "Média écrit et électronique") &&
        (!data.specialite ||
          !specialites.some((s) => s.name_fr === data.specialite))
      ) {
        errors.specialite = t.required.replace(":attribute", t.specialite);
      }
    }

    if (data.secteur_travail === "Privé") {
      if (data.categorie !== "Privé")
        errors.categorie = t.invalid_category_private;
      if (data.type_media !== "Privé")
        errors.type_media = t.invalid_media_type_private;
      if (!data.langue || !langues.some((l) => l.nom_fr === data.langue)) {
        errors.langue = t.required.replace(":attribute", t.langue);
      }
      if (
        !data.specialite ||
        !specialites.some((s) => s.name_fr === data.specialite)
      ) {
        errors.specialite = t.required.replace(":attribute", t.specialite);
      }
    }

    console.log("🔍 [validateFormErrors] Erreurs détectées :", errors);
    setFormErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    console.log("✅ [validateFormErrors] Formulaire valide ? :", isValid);
    return isValid;
  }, [data, t]);

  useEffect(() => {
    console.log("🔄 [useEffect] État actuel de data mis à jour :", data);
  }, [data]);

  useEffect(() => {
    console.log(
      "🚫 [useEffect] Erreurs actuelles du formulaire (formErrors) :",
      formErrors
    );
  }, [formErrors]);

  useEffect(() => {
    console.log(
      "✅ [useEffect] Statut du formulaire complet ? :",
      isFormComplete()
    );
  }, [data, isFormComplete]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 [handleSubmit] Soumission de Step2 déclenchée avec data :", { data });
    const professionalCardValid = await validateProfessionalCard(data.id_professional_card);
    const attestationNumberValid = await validateAttestationNumber(data.num_attes);
    if (!professionalCardValid || !attestationNumberValid) {
      console.error("❌ [handleSubmit] Carte professionnelle ou numéro d'attestation invalide.");
      return;
    }
    if (!validateFormErrors()) {
      console.error("❌ [handleSubmit] Formulaire incomplet, vérifiez les champs.");
      return;
    }
    console.log("✅ [handleSubmit] Formulaire valide, passage à l'étape suivante.");
    onNext();
  };

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onNext(); }}
      className={`space-y-6 w-full max-w-5xl bg-white shadow-md rounded-lg p-8 ${interfaceLocale === "ar" ? "text-right" : ""
        }`}
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
      {attestationNumberError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {attestationNumberError}
        </div>
      )}
      {attestationNumberExistsMessage && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          {attestationNumberExistsMessage}
        </div>
      )}
      {/* {Object.keys(formErrors).length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <ul>
            {Object.values(formErrors).map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </div>
      )} */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {getLabel("id_professional_card", t.id_professional_card)}
          </label>
          <input
            name="id_professional_card"
            value={data.id_professional_card || ""}
            onChange={handleProfessionalCardChange}
            onKeyPress={(e) => {
              const charCode = e.charCode;
              if (charCode < 48 || charCode > 57) {
                e.preventDefault();
              }
            }}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
              }`}
            placeholder={t.id_professional_card}
            disabled={isProfessionalCardDisabled}
            required
          />
          {formErrors.id_professional_card && (
            <p className="text-red-500 text-sm">
              {formErrors.id_professional_card}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {getLabel("num_attes", t.num_attes)}
          </label>
          <input
            name="num_attes"
            value={data.num_attes || ""}
            onChange={handleAttestationNumberChange}
            placeholder={t.num_attes}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""}`}
            disabled={isAttestationNumberDisabled}
            required
          />
          {formErrors.num_attes && (
            <p className="text-red-500 text-sm">{formErrors.num_attes}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {getLabel("fonction_fr", t.fonction_fr)}
          </label>
          <input
            name="fonction_fr"
            value={data.fonction_fr || ""}
            onChange={onChange}
            placeholder={t.fonction_fr}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
          {formErrors.fonction_fr && (
            <p className="text-red-500 text-sm">{formErrors.fonction_fr}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {getLabel("fonction_ar", t.fonction_ar)}
          </label>
          <input
            name="fonction_ar"
            value={data.fonction_ar || ""}
            onChange={onChange}
            placeholder={t.fonction_ar}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-right`}
            required
          />
          {formErrors.fonction_ar && (
            <p className="text-red-500 text-sm">{formErrors.fonction_ar}</p>
          )}
        </div>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">
          {getLabel("secteur_travail", t.secteur_travail)}
        </label>
        <select
          name="secteur_travail"
          value={data.secteur_travail || ""}
          onChange={handleSecteurChange}
          className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
            }`}
          required
        >
          <option value="">{t.secteur_travail}</option>
          {secteurs.map((s, index) => (
            <option key={index} value={s.nom_fr_sect}>
              {interfaceLocale === "ar" ? s.nom_ar_sect : s.nom_fr_sect}
            </option>
          ))}
        </select>
        {formErrors.secteur_travail && (
          <p className="text-red-500 text-sm">{formErrors.secteur_travail}</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.secteur_travail === "Public" && (
          <>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                {getLabel("categorie", t.categorie)}
              </label>
              <select
                name="categorie"
                value={data.categorie || ""}
                onChange={handleCategorieChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
                  }`}
                required
              >
                <option value="">{t.categorie}</option>
                {categories
                  .filter((c) => c.id_sect === 2)
                  .map((c, index) => (
                    <option key={index} value={c.nom_fr_etat}>
                      {interfaceLocale === "ar" ? c.nom_ar_etat : c.nom_fr_etat}
                    </option>
                  ))}
              </select>
              {formErrors.categorie && (
                <p className="text-red-500 text-sm">{formErrors.categorie}</p>
              )}
            </div>
            {data.categorie === "Média audio" && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  {getLabel("type_media", t.type_media)}
                </label>
                <select
                  name="type_media"
                  value={data.type_media || ""}
                  onChange={handleTypeMediaChange}
                  className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
                    }`}
                  required
                >
                  <option value="">{t.type_media}</option>
                  {typesMedia
                    .filter((t) => t.categorie === "Média audio")
                    .map((t, index) => (
                      <option key={index} value={t.nom_fr_type_media}>
                        {interfaceLocale === "ar"
                          ? t.nom_ar_type_media
                          : t.nom_fr_type_media}
                      </option>
                    ))}
                </select>
                {formErrors.type_media && (
                  <p className="text-red-500 text-sm">
                    {formErrors.type_media}
                  </p>
                )}
              </div>
            )}
            {data.categorie === "Média audio" && data.type_media === "TV" && (
              <>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    {getLabel("tv", t.tv)}
                  </label>
                  <select
                    name="tv"
                    value={data.tv || ""}
                    onChange={onChange}
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
                      }`}
                    required
                  >
                    <option value="">{t.tv}</option>
                    {tvOptions.map((option, index) => (
                      <option key={index} value={option.nom_fr}>
                        {interfaceLocale === "ar"
                          ? option.nom_ar
                          : option.nom_fr}
                      </option>
                    ))}
                  </select>
                  {formErrors.tv && (
                    <p className="text-red-500 text-sm">{formErrors.tv}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    {getLabel("specialite", t.specialite)}
                  </label>
                  <select
                    name="specialite"
                    value={data.specialite || ""}
                    onChange={onChange}
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
                      }`}
                    required={
                      data.secteur_travail === "Privé" ||
                      (data.secteur_travail === "Public" &&
                        (data.type_media === "TV" ||
                          data.categorie === "Média écrit et électronique"))
                    }
                  >
                    <option value="">{t.specialite}</option>
                    {specialites.map((s, index) => (
                      <option key={index} value={s.name_fr}>
                        {interfaceLocale === "ar" ? s.name_ar : s.name_fr}
                      </option>
                    ))}
                  </select>
                  {formErrors.specialite && (
                    <p className="text-red-500 text-sm">
                      {formErrors.specialite}
                    </p>
                  )}
                </div>
              </>
            )}
            {data.categorie === "Média audio" &&
              data.type_media === "Radio" && (
                <>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      {getLabel("radio", t.radio)}
                    </label>
                    <select
                      name="radio"
                      value={data.radio || ""}
                      onChange={onChange}
                      className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
                        }`}
                      required
                    >
                      <option value="">{t.radio}</option>
                      {radioOptions.map((option, index) => (
                        <option key={index} value={option.nom_fr}>
                          {interfaceLocale === "ar"
                            ? option.nom_ar
                            : option.nom_fr}
                        </option>
                      ))}
                    </select>
                    {formErrors.radio && (
                      <p className="text-red-500 text-sm">{formErrors.radio}</p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      {getLabel("specialite", t.specialite)}
                    </label>
                    <select
                      name="specialite"
                      value={data.specialite || ""}
                      onChange={onChange}
                      className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
                        }`}
                      required={
                        data.secteur_travail === "Privé" ||
                        (data.secteur_travail === "Public" &&
                          (data.type_media === "TV" ||
                            data.categorie === "Média écrit et électronique"))
                      }
                    >
                      <option value="">{t.specialite}</option>
                      {specialites.map((s, index) => (
                        <option key={index} value={s.name_fr}>
                          {interfaceLocale === "ar" ? s.name_ar : s.name_fr}
                        </option>
                      ))}
                    </select>
                    {formErrors.specialite && (
                      <p className="text-red-500 text-sm">
                        {formErrors.specialite}
                      </p>
                    )}
                  </div>
                </>
              )}
            {data.categorie === "Média écrit et électronique" && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  {getLabel("media", t.media)}
                </label>
                <select
                  name="media"
                  value={data.media || ""}
                  onChange={handleMediaChange}
                  className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
                    }`}
                  required
                >
                  <option value="">{t.media}</option>
                  {typesMedia
                    .filter(
                      (t) => t.categorie === "Média écrit et électronique"
                    )
                    .map((t, index) => (
                      <option key={index} value={t.nom_fr_type_media}>
                        {interfaceLocale === "ar"
                          ? t.nom_ar_type_media
                          : t.nom_fr_type_media}
                      </option>
                    ))}
                </select>
                {formErrors.media && (
                  <p className="text-red-500 text-sm">{formErrors.media}</p>
                )}
              </div>
            )}
          </>
        )}
        {data.secteur_travail === "Privé" && (
          <>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                {getLabel("langue", t.langue)}
              </label>
              <select
                name="langue"
                value={data.langue || ""}
                onChange={onChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
                  }`}
                required
              >
                <option value="">{t.langue}</option>
                {langues.map((l, index) => (
                  <option key={index} value={l.nom_fr}>
                    {interfaceLocale === "ar" ? l.nom_ar : l.nom_fr}
                  </option>
                ))}
              </select>
              {formErrors.langue && (
                <p className="text-red-500 text-sm">{formErrors.langue}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                {getLabel("specialite", t.specialite)}
              </label>
              <select
                name="specialite"
                value={data.specialite || ""}
                onChange={onChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
                  }`}
                required={
                  data.secteur_travail === "Privé" ||
                  (data.secteur_travail === "Public" &&
                    (data.type_media === "TV" ||
                      data.categorie === "Média écrit et électronique"))
                }
              >
                <option value="">{t.specialite}</option>
                {specialites.map((s, index) => (
                  <option key={index} value={s.name_fr}>
                    {interfaceLocale === "ar" ? s.name_ar : s.name_fr}
                  </option>
                ))}
              </select>
              {formErrors.specialite && (
                <p className="text-red-500 text-sm">{formErrors.specialite}</p>
              )}
            </div>
          </>
        )}
      </div>
      {data.categorie === "Média écrit et électronique" && (
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {getLabel("specialite", t.specialite)}
          </label>
          <select
            name="specialite"
            value={data.specialite || ""}
            onChange={onChange}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
              }`}
            required={
              data.secteur_travail === "Privé" ||
              (data.secteur_travail === "Public" &&
                (data.type_media === "TV" ||
                  data.categorie === "Média écrit et électronique"))
            }
          >
            <option value="">{t.specialite}</option>
            {specialites.map((s, index) => (
              <option key={index} value={s.name_fr}>
                {interfaceLocale === "ar" ? s.name_ar : s.name_fr}
              </option>
            ))}
          </select>
          {formErrors.specialite && (
            <p className="text-red-500 text-sm">{formErrors.specialite}</p>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {getLabel("nom_etablissement", t.nom_etablissement)}
          </label>
          <input
            name="nom_etablissement"
            value={data.nom_etablissement || ""}
            onChange={onChange}
            placeholder={t.nom_etablissement}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
          {formErrors.nom_etablissement && (
            <p className="text-red-500 text-sm">
              {formErrors.nom_etablissement}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {getLabel("nom_etablissement_ar", t.nom_etablissement_ar)}
          </label>
          <input
            name="nom_etablissement_ar"
            value={data.nom_etablissement_ar || ""}
            onChange={onChange}
            placeholder={t.nom_etablissement_ar}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-right`}
            required
          />
          {formErrors.nom_etablissement_ar && (
            <p className="text-red-500 text-sm">
              {formErrors.nom_etablissement_ar}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {getLabel("email", t.email)}
          </label>
          <input
            name="email"
            value={data.email || ""}
            onChange={onChange}
            onBlur={handleEmailBlur}
            placeholder={t.email}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
          {formErrors.email && (
            <p className="text-red-500 text-sm">{formErrors.email}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {getLabel("tel", t.tel)}
          </label>
          <div className={`flex items-center ${interfaceLocale === "ar" ? "flex-row-reverse" : "flex-row"}`} dir={interfaceLocale === "ar" ? "rtl" : "ltr"}>
            <div className="relative">
              <button
                type="button"
                className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 rounded-l-lg border-r-0"
                disabled
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 900 600"
                  className="h-4 w-6"
                >
                  <rect width="450" height="600" fill="#006233" />
                  <rect x="450" width="450" height="600" fill="#FFFFFF" />
                  <path
                    fill="#D21034"
                    d="M 510 300 A 150 150 0 1 1 510 299 A 90 90 0 1 0 510 301 Z"
                  />
                  <polygon
                    fill="#D21034"
                    points="570,300 542,312 550,340 525,322 500,340 508,312 480,300 508,288 500,260 525,278 550,260 542,288"
                  />
                </svg>
                &nbsp;
              </button>
            </div>
            <div className="relative w-full">
              <input
                type="text"
                name="tel"
                value={data.tel || ""}
                onChange={handlePhoneChange}
                onBlur={handlePhoneBlur}
                onKeyPress={(e) => {
                  const charCode = e.charCode;
                  if (charCode < 48 || charCode > 57) {
                    e.preventDefault();
                  }
                }}
                className={`block p-2.5 w-full text-sm text-gray-900 bg-white border border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${interfaceLocale === "ar" ? "text-right rounded-r-lg border-l-0" : "rounded-r-lg border-l-0"}`}
                placeholder={interfaceLocale === "fr" ? "0123456789" : "0123456789"}
                pattern="[0-9]{10}"
                maxLength="10"
              />
            </div>
          </div>
          {formErrors.tel && (
            <p className="text-red-500 text-sm">{formErrors.tel}</p>
          )}
        </div>
      </div>
      {/* Section attestation_travail */}
      <div>
        <label
          className="block mb-2 text-sm font-medium text-gray-900"
          htmlFor="attestation_travail"
        >
          {getLabel("attestation_travail", t.attestation_travail)}
        </label>
        {data.fichiers &&
          data.fichiers.some((f) => f.type === "attestation_travail") && (
            <div className="mb-2">
              <p className="text-sm text-gray-600">
                {interfaceLocale === "fr" ? "Fichier existant :" : "الملف الموجود :"}{" "}
                {interfaceLocale === "fr"
                  ? data.fichiers.find((f) => f.type === "attestation_travail").nom_fichier_fr
                  : data.fichiers.find((f) => f.type === "attestation_travail").nom_fichier_ar}{" "}
                <a
                  href={`http://localhost:8000/storage/${data.fichiers.find((f) => f.type === "attestation_travail").file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {interfaceLocale === "fr" ? "(Voir)" : "(عرض)"}
                </a>
              </p>
            </div>
          )}
        <label
          className={`relative inline-block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus-within:ring-blue-500 focus-within:border-blue-500 w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""}`}
        >
          <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
            {interfaceLocale === "fr" ? "Sélectionner un fichier" : "اختر ملفًا"}
          </span>
          <input
            type="file"
            name="attestation_travail"
            onChange={handleFileChange}
            accept="application/pdf"
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            required={!data.fichiers || !data.fichiers.some((f) => f.type === "attestation_travail")}
          />
        </label>
        {selectedAttestationTravail && (
          <div className={`mt-2 ${interfaceLocale === "ar" ? "text-right" : ""}`}>
            <p className="text-sm font-medium text-gray-900">
              {interfaceLocale === "fr" ? "Fichier sélectionné :" : "الملف المختار :"}
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-600">
              <li>
                {selectedAttestationTravail.name}{" "}
                <button
                  type="button"
                  onClick={() => handlePreviewFile(selectedAttestationTravail)}
                  className="text-blue-600 hover:underline"
                >
                  {interfaceLocale === "fr" ? "(Voir)" : "(عرض)"}
                </button>{" "}
                <button
                  type="button"
                  onClick={handleRemoveAttestationTravail}
                  className="text-red-600 hover:underline"
                >
                  {interfaceLocale === "fr" ? "(Supprimer)" : "(حذف)"}
                </button>
              </li>
            </ul>
          </div>
        )}
        {formErrors.attestation_travail && (
          <p className="text-red-500 text-sm">{formErrors.attestation_travail}</p>
        )}
      </div>

      {/* Section carte_professionnelle */}
      <div>
        <label
          className="block mb-2 text-sm font-medium text-gray-900"
          htmlFor="carte_professionnelle"
        >
          {getLabel("carte_professionnelle", t.carte_professionnelle)}
        </label>
        {data.fichiers &&
          data.fichiers.some((f) => f.type === "carte_professionnelle") && (
            <div className="mb-2">
              <p className="text-sm text-gray-600">
                {interfaceLocale === "fr" ? "Fichier existant :" : "الملف الموجود :"}{" "}
                {interfaceLocale === "fr"
                  ? data.fichiers.find((f) => f.type === "carte_professionnelle").nom_fichier_fr
                  : data.fichiers.find((f) => f.type === "carte_professionnelle").nom_fichier_ar}{" "}
                <a
                  href={`http://localhost:8000/storage/${data.fichiers.find((f) => f.type === "carte_professionnelle").file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {interfaceLocale === "fr" ? "(Voir)" : "(عرض)"}
                </a>
              </p>
            </div>
          )}
        <label
          className={`relative inline-block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus-within:ring-blue-500 focus-within:border-blue-500 w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""}`}
        >
          <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
            {interfaceLocale === "fr" ? "Sélectionner un fichier" : "اختر ملفًا"}
          </span>
          <input
            type="file"
            name="carte_professionnelle"
            onChange={handleFileChange}
            accept="application/pdf"
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            required={!data.fichiers || !data.fichiers.some((f) => f.type === "carte_professionnelle")}
          />
        </label>
        {selectedCarteProfessionnelle && (
          <div className={`mt-2 ${interfaceLocale === "ar" ? "text-right" : ""}`}>
            <p className="text-sm font-medium text-gray-900">
              {interfaceLocale === "fr" ? "Fichier sélectionné :" : "الملف المختار :"}
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-600">
              <li>
                {selectedCarteProfessionnelle.name}{" "}
                <button
                  type="button"
                  onClick={() => handlePreviewFile(selectedCarteProfessionnelle)}
                  className="text-blue-600 hover:underline"
                >
                  {interfaceLocale === "fr" ? "(Voir)" : "(عرض)"}
                </button>{" "}
                <button
                  type="button"
                  onClick={handleRemoveCarteProfessionnelle}
                  className="text-red-600 hover:underline"
                >
                  {interfaceLocale === "fr" ? "(Supprimer)" : "(حذف)"}
                </button>
              </li>
            </ul>
          </div>
        )}
        {formErrors.carte_professionnelle && (
          <p className="text-red-500 text-sm">{formErrors.carte_professionnelle}</p>
        )}
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
          disabled={!isFormComplete() || !!professionalCardError}
        >
          {t.next_step}
        </button>
      </div>
    </form>
  );
}
