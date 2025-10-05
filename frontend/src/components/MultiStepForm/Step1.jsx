import React, { useEffect, useState, useCallback } from "react";

const Step1 = ({
  data = {},

  onChange,

  onFileChange,

  onNext,

  error,

  wilayas,

  isLoadingWilayas,

  interfaceLocale,

  t,
}) => {
  const [ninError, setNinError] = useState("");

  const [ninExistsMessage, setNinExistsMessage] = useState("");

  const [isNinDisabled, setIsNinDisabled] = useState(false);

  const [formErrors, setFormErrors] = useState({});

  const [selectedCarteNationaleName, setSelectedCarteNationaleName] =
    useState("");

  const [selectedPhotoName, setSelectedPhotoName] = useState("");

  //console.log('step1 - interfaceLocale:', interfaceLocale, 't:', t);

  // Mapper pour sexe

  const sexeMap = {
    frToAr: {
      Masculin: "ذكر",

      Féminin: "أنثى",
    },

    arToFr: {
      ذكر: "Masculin",

      أنثى: "Féminin",
    },
  };

  // Fonction pour formater la date ISO en yyyy-MM-dd

  const formatDateForInput = useCallback((isoDate) => {
    if (!isoDate) return "";

    return isoDate.split("T")[0];
  }, []);

  // Valider le NIN

  const validateNin = useCallback(
    async (value) => {
      if (!value) {
        setNinError(t.required.replace(":attribute", t.id_nin_personne));

        setNinExistsMessage("");

        return false;
      }

      if (value.length !== 18) {
        setNinError(t.nin_invalid);

        setNinExistsMessage("");

        return false;
      }

      if (!/^[0-9]{18}$/.test(value)) {
        setNinError(t.nin_invalid);

        setNinExistsMessage("");

        return false;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/check-nin?nin=${value}&locale=${interfaceLocale}`,

          {
            headers: { Accept: "application/json" },

            credentials: "include", // Inclure les cookies pour l'authentification
          }
        );

        const result = await response.json();

        console.log("Réponse API check-nin:", result); // Log pour débogage

        if (response.ok) {
          if (result.exists) {
            // Si le NIN existe et appartient à un autre utilisateur

            if (result.message === t.nin_belongs_to_another_user) {
              setNinError(t.nin_belongs_to_another_user);

              setNinExistsMessage("");

              setIsNinDisabled(false);

              // Réinitialiser les champs du formulaire pour éviter d'afficher les données d'un autre utilisateur

              onChange({
                target: {
                  name: "batch",

                  value: {
                    id_nin_personne: value,

                    nom_personne_fr: "",

                    prenom_personne_fr: "",

                    nom_personne_ar: "",

                    prenom_personne_ar: "",

                    date_naissance: "",

                    lieu_naissance_fr: "",

                    lieu_naissance_ar: "",

                    nationalite_fr: "Algerienne",

                    nationalite_ar: "جزائرية",

                    num_tlf_personne: "",

                    adresse_fr: "",

                    adresse_ar: "",

                    sexe_personne_fr: "",

                    sexe_personne_ar: "",

                    groupage: "",

                    carte_nationale: null,

                    photo: null,

                    id_professional_card: "",

                    fonction_fr: "",

                    fonction_ar: "",

                    fichiers: [],
                  },
                },
              });

              return false;
            }

            // Si le NIN existe et appartient à l'utilisateur actuel

            setNinExistsMessage(
              interfaceLocale === "fr"
                ? "Ce numéro NIN existe déjà dans la base de données."
                : "رقم الهوية الوطنية موجود مسبقًا في قاعدة البيانات."
            );

            setIsNinDisabled(true);

            if (result.data) {
              onChange({
                target: {
                  name: "batch",

                  value: {
                    id_nin_personne: result.data.id_nin_personne || "",

                    nom_personne_fr: result.data.nom_personne_fr || "",

                    prenom_personne_fr: result.data.prenom_personne_fr || "",

                    nom_personne_ar: result.data.nom_personne_ar || "",

                    prenom_personne_ar: result.data.prenom_personne_ar || "",

                    date_naissance:
                      formatDateForInput(result.data.date_naissance) || "",

                    lieu_naissance_fr: result.data.lieu_naissance_fr || "",

                    lieu_naissance_ar: result.data.lieu_naissance_ar || "",

                    nationalite_fr: result.data.nationalite_fr || "Algerienne",

                    nationalite_ar: result.data.nationalite_ar || "جزائرية",

                    num_tlf_personne: result.data.num_tlf_personne || "",

                    adresse_fr: result.data.adresse_fr || "",

                    adresse_ar: result.data.adresse_ar || "",

                    sexe_personne_fr: result.data.sexe_personne_fr || "",

                    sexe_personne_ar: result.data.sexe_personne_ar || "",

                    groupage: result.data.groupage || "",

                    id_professional_card:
                      result.data.id_professional_card || "",

                    fonction_fr: result.data.fonction_fr || "",

                    fonction_ar: result.data.fonction_ar || "",

                    fichiers: result.data.fichiers || [],
                  },
                },
              });
            }

            setNinError("");

            return true;
          } else {
            // Si le NIN n'existe pas

            setNinExistsMessage("");

            setIsNinDisabled(false);

            onChange({
              target: {
                name: "batch",

                value: {
                  id_nin_personne: value,

                  nom_personne_fr: "",

                  prenom_personne_fr: "",

                  nom_personne_ar: "",

                  prenom_personne_ar: "",

                  date_naissance: "",

                  lieu_naissance_fr: "",

                  lieu_naissance_ar: "",

                  nationalite_fr: "Algerienne",

                  nationalite_ar: "جزائرية",

                  num_tlf_personne: "",

                  adresse_fr: "",

                  adresse_ar: "",

                  sexe_personne_fr: "",

                  sexe_personne_ar: "",

                  groupage: "",

                  carte_nationale: null,

                  photo: null,

                  id_professional_card: "",

                  fonction_fr: "",

                  fonction_ar: "",

                  fichiers: [],
                },
              },
            });

            setNinError("");

            return true;
          }
        } else {
          setNinError(
            result.message ||
            t.required.replace(":attribute", t.id_nin_personne)
          );

          setNinExistsMessage("");

          return false;
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du NIN :", error);

        setNinError(t.required.replace(":attribute", t.id_nin_personne));

        setNinExistsMessage("");

        return false;
      }
    },

    [onChange, formatDateForInput, t, interfaceLocale]
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

  // Valider le numéro de téléphone

  const validatePhoneNumber = (value) => {
    if (!value || value.length !== 10 || !/^[0-9]{10}$/.test(value)) {
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

      num_tlf_personne: phoneError,
    }));
  };

  // Gérer les changements avec synchronisation

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updates = { [name]: value };

    // Synchroniser lieu_naissance

    if (name === "lieu_naissance_fr") {
      const wilaya = wilayas.find((w) => w.name_fr === value);

      if (wilaya) updates.lieu_naissance_ar = wilaya.name_ar;
    } else if (name === "lieu_naissance_ar") {
      const wilaya = wilayas.find((w) => w.name_ar === value);

      if (wilaya) updates.lieu_naissance_fr = wilaya.name_fr;
    }

    // Synchroniser sexe
    else if (name === "sexe_personne_fr") {
      updates.sexe_personne_ar = sexeMap.frToAr[value] || value;
    } else if (name === "sexe_personne_ar") {
      updates.sexe_personne_fr = sexeMap.arToFr[value] || value;
    }

    onChange({ target: { name: "batch", value: updates } });
  };

  // Fonction utilitaire pour tronquer les noms de fichiers longs (optionnel pour l'affichage)
  const truncateFileName = (name, maxLength = 50) => {
    if (name.length <= maxLength) return name;
    const extension = name.split('.').pop();
    const baseName = name.slice(0, name.lastIndexOf('.'));
    return `${baseName.slice(0, maxLength - 10 - extension.length)}...${baseName.slice(-5)}.${extension}`;
  };

  // Gestion du changement de fichier pour carte_nationale
  const handleCarteNationaleChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 2 Mo en octets
    const maxNameLength = 100; // Limite pour le nom du fichier (caractères)

    if (file) {
      // Vérification de la longueur du nom
      if (file.name.length > maxNameLength) {
        setFormErrors((prev) => ({
          ...prev,
          carte_nationale:
            t.file_name_too_long?.replace(":max", maxNameLength) ||
            (interfaceLocale === "fr"
              ? `Nom du fichier trop long (maximum ${maxNameLength} caractères). Veuillez renommer le fichier.`
              : `اسم الملف طويل جدًا (حد أقصى ${maxNameLength} حرف). يرجى إعادة تسمية الملف.`),
        }));
        setSelectedCarteNationaleName("");
        return;
      }

      // Vérification de la taille
      if (file.size > maxSize) {
        setFormErrors((prev) => ({
          ...prev,
          carte_nationale:
            t.max_file_size?.replace(":attribute", t.carte_nationale)?.replace(":max", "2 Mo") ||
            (interfaceLocale === "fr"
              ? "La taille de la carte nationale ne doit pas dépasser 2 Mo."
              : "حجم البطاقة الوطنية يجب ألا يتجاوز 2 ميغابايت."),
        }));
        setSelectedCarteNationaleName("");
        return;
      } else {
        // Effacer l'erreur si le fichier est valide
        setFormErrors((prev) => ({
          ...prev,
          carte_nationale: "",
        }));
      }
      setSelectedCarteNationaleName(truncateFileName(file.name)); // Affichage tronqué si long
      onFileChange(e);
    } else {
      setSelectedCarteNationaleName("");
    }
  };

  // Gestion du changement de fichier pour photo
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 2 Mo en octets
    const maxNameLength = 100; // Limite pour le nom du fichier (caractères)

    if (file) {
      // Vérification de la longueur du nom
      if (file.name.length > maxNameLength) {
        setFormErrors((prev) => ({
          ...prev,
          photo:
            t.file_name_too_long?.replace(":max", maxNameLength) ||
            (interfaceLocale === "fr"
              ? `Nom du fichier trop long (maximum ${maxNameLength} caractères). Veuillez renommer le fichier.`
              : `اسم الملف طويل جدًا (حد أقصى ${maxNameLength} حرف). يرجى إعادة تسمية الملف.`),
        }));
        setSelectedPhotoName("");
        return;
      }

      // Vérification de la taille
      if (file.size > maxSize) {
        setFormErrors((prev) => ({
          ...prev,
          photo:
            t.max_file_size?.replace(":attribute", t.photo)?.replace(":max", "2 Mo") ||
            (interfaceLocale === "fr"
              ? "La taille de la photo ne doit pas dépasser 2 Mo."
              : "حجم الصورة يجب ألا يتجاوز 2 ميغابايت."),
        }));
        setSelectedPhotoName("");
        return;
      } else {
        // Effacer l'erreur si le fichier est valide
        setFormErrors((prev) => ({
          ...prev,
          photo: "",
        }));
      }
      setSelectedPhotoName(truncateFileName(file.name)); // Affichage tronqué si long
      onFileChange(e);
    } else {
      setSelectedPhotoName("");
    }
  };

  // Fonction pour générer les labels avec * ou (facultatif)
  const getLabel = (fieldName, labelText) => {
    const requiredFields = [
      "id_nin_personne",

      "nom_personne_fr",

      "prenom_personne_fr",

      "nom_personne_ar",

      "prenom_personne_ar",

      "date_naissance",

      "nationalite_fr",

      "nationalite_ar",

      "num_tlf_personne",

      "adresse_fr",

      "adresse_ar",

      "groupage",

      "carte_nationale", // Ajouté comme obligatoire

      "photo", // Ajouté comme obligatoire
    ];

    const conditionalRequired = {
      lieu_naissance_fr: interfaceLocale === "fr",

      lieu_naissance_ar: interfaceLocale === "ar",

      sexe_personne_fr: interfaceLocale === "fr",

      sexe_personne_ar: interfaceLocale === "ar",
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

      num_tlf_personne:
        data.num_tlf_personne && /^[0-9]{10}$/.test(data.num_tlf_personne),

      adresse_fr: data.adresse_fr?.trim(),

      adresse_ar: data.adresse_ar?.trim(),

      sexe_personne_fr: !!data.sexe_personne_fr,

      sexe_personne_ar: !!data.sexe_personne_ar,

      groupage: !!data.groupage,

      carte_nationale:
        data.carte_nationale instanceof File ||
        (data.fichiers &&
          data.fichiers.some((f) => f.type === "carte_nationale")),

      photo:
        data.photo instanceof File ||
        (data.fichiers && data.fichiers.some((f) => f.type === "photo")),

      isLoadingWilayas: !isLoadingWilayas,
    };

    return Object.values(checks).every((value) => !!value) && !ninError;
  }, [data, isLoadingWilayas, ninError]);

  // Valider les erreurs du formulaire
  const validateFormErrors = useCallback(() => {
    const errors = {};

    if (
      !data.id_nin_personne ||
      data.id_nin_personne.length !== 18 ||
      !/^[0-9]{18}$/.test(data.id_nin_personne)
    ) {
      errors.id_nin_personne = t.nin_invalid;
    }

    if (!data.nom_personne_fr?.trim()) {
      errors.nom_personne_fr = t.required.replace(
        ":attribute",
        t.nom_personne_fr
      );
    }

    if (!data.prenom_personne_fr?.trim()) {
      errors.prenom_personne_fr = t.required.replace(
        ":attribute",
        t.prenom_personne_fr
      );
    }

    if (!data.nom_personne_ar?.trim()) {
      errors.nom_personne_ar = t.required.replace(
        ":attribute",
        t.nom_personne_ar
      );
    }

    if (!data.prenom_personne_ar?.trim()) {
      errors.prenom_personne_ar = t.required.replace(
        ":attribute",
        t.prenom_personne_ar
      );
    }

    if (!data.date_naissance) {
      errors.date_naissance = t.required.replace(
        ":attribute",
        t.date_naissance
      );
    }

    if (!data.lieu_naissance_fr) {
      errors.lieu_naissance_fr = t.required.replace(
        ":attribute",
        t.lieu_naissance_fr
      );
    }

    if (!data.lieu_naissance_ar) {
      errors.lieu_naissance_ar = t.required.replace(
        ":attribute",
        t.lieu_naissance_ar
      );
    }

    if (!data.nationalite_fr) {
      errors.nationalite_fr = t.required.replace(
        ":attribute",
        t.nationalite_fr
      );
    }

    if (!data.nationalite_ar) {
      errors.nationalite_ar = t.required.replace(
        ":attribute",
        t.nationalite_ar
      );
    }

    if (!data.num_tlf_personne || !/^[0-9]{10}$/.test(data.num_tlf_personne)) {
      errors.num_tlf_personne = t.phone_invalid;
    }

    if (!data.adresse_fr?.trim()) {
      errors.adresse_fr = t.required.replace(":attribute", t.adresse_fr);
    }

    if (!data.adresse_ar?.trim()) {
      errors.adresse_ar = t.required.replace(":attribute", t.adresse_ar);
    }

    if (!data.sexe_personne_fr) {
      errors.sexe_personne_fr = t.required.replace(
        ":attribute",
        t.sexe_personne_fr
      );
    }

    if (!data.sexe_personne_ar) {
      errors.sexe_personne_ar = t.required.replace(
        ":attribute",
        t.sexe_personne_ar
      );
    }

    if (!data.groupage) {
      errors.groupage = t.required.replace(":attribute", t.groupage);
    }

    if (
      !data.carte_nationale &&
      (!data.fichiers ||
        !data.fichiers.some((f) => f.type === "carte_nationale"))
    ) {
      errors.carte_nationale = t.required.replace(
        ":attribute",
        t.carte_nationale
      );
    }

    if (
      !data.photo &&
      (!data.fichiers || !data.fichiers.some((f) => f.type === "photo"))
    ) {
      errors.photo = t.required.replace(":attribute", t.photo);
    }

    if (isLoadingWilayas || wilayas.length === 0) {
      errors.wilayas =
        interfaceLocale === "fr"
          ? "Les wilayas ne sont pas chargées."
          : "لم يتم تحميل الولايات.";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  }, [data, t, isLoadingWilayas, wilayas]);

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFormErrors()) {
      console.error("Formulaire incomplet, vérifiez les champs.");

      return;
    }

    try {
      const form = new FormData();

      form.append("id_nin_personne", data.id_nin_personne || "");

      form.append("nom_personne_fr", data.nom_personne_fr || "");

      form.append("prenom_personne_fr", data.prenom_personne_fr || "");

      form.append("nom_personne_ar", data.nom_personne_ar || "");

      form.append("prenom_personne_ar", data.prenom_personne_ar || "");

      form.append("date_naissance", data.date_naissance || "");

      form.append("lieu_naissance_fr", data.lieu_naissance_fr || "");

      form.append("lieu_naissance_ar", data.lieu_naissance_ar || "");

      form.append("nationalite_fr", data.nationalite_fr || "");

      form.append("nationalite_ar", data.nationalite_ar || "");

      form.append("num_tlf_personne", data.num_tlf_personne || "");

      form.append("adresse_fr", data.adresse_fr || "");

      form.append("adresse_ar", data.adresse_ar || "");

      form.append("sexe_personne_fr", data.sexe_personne_fr || "");

      form.append("sexe_personne_ar", data.sexe_personne_ar || "");

      form.append("groupage", data.groupage || "");

      form.append("id_professional_card", data.id_professional_card || "");

      form.append("fonction_fr", data.fonction_fr || "");

      form.append("fonction_ar", data.fonction_ar || "");

      if (data.carte_nationale)
        form.append("carte_nationale", data.carte_nationale);

      if (data.photo) form.append("photo", data.photo);

      form.append("locale", interfaceLocale);

      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",

        headers: { Accept: "application/json" },
      });

      const token = document.cookie

        .split("; ")

        .find((row) => row.startsWith("XSRF-TOKEN="))

        ?.split("=")[1];

      const response = await fetch("http://localhost:8000/soumission/step1", {
        method: "POST",

        body: form,

        credentials: "include",

        headers: {
          "X-XSRF-TOKEN": decodeURIComponent(token),

          Accept: "application/json",
        },
      });

      const result = await response.json();

      console.log("Réponse API storeStep1:", result); // Débogage

      if (!response.ok) {
        const errorData = result;

        setNinError(errorData.error || `Erreur HTTP ${response.status}`);

        return;
      }

      console.log(
        result.message ||
        (interfaceLocale === "fr"
          ? "Étape 1 soumise avec succès"
          : "تم إرسال الخطوة 1 بنجاح")
      );

      onNext(); // Passer à l'étape suivante uniquement si succès
    } catch (err) {
      console.error("Erreur lors de la soumission :", err);

      setNinError(t.required.replace(":attribute", "soumission"));
    }
  };

  // useEffect pour débogage et réévaluation
  useEffect(() => {
    console.log("Data:", data);

    console.log("isLoadingWilayas:", isLoadingWilayas);

    console.log("ninError:", ninError);

    console.log("isFormComplete:", isFormComplete());
  }, [data, isLoadingWilayas, ninError]);

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-6 w-full max-w-5xl bg-white shadow-md rounded-lg p-8 ${interfaceLocale === "ar" ? "text-right" : ""
        }`}
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {ninError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {ninError}
        </div>
      )}

      {ninExistsMessage && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          {ninExistsMessage}
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

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">
          {getLabel("id_nin_personne", t.id_nin_personne)}
        </label>

        <input
          name="id_nin_personne"
          value={data.id_nin_personne || ""}
          onChange={handleNinChange}
          onKeyPress={(e) => {
            const charCode = e.charCode;

            // Autoriser uniquement les chiffres (charCode entre 48 et 57 correspond à 0-9)

            if (charCode < 48 || charCode > 57) {
              e.preventDefault();
            }
          }}
          className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
            }`}
          placeholder={t.id_nin_personne}
          disabled={isNinDisabled}
          maxLength="18"
          required
          pattern="[0-9]{18}" // Validation HTML5 pour 18 chiffres
          title={t.nin_invalid || "Le numéro NIN doit contenir 18 chiffres."} // Message pour la validation HTML5
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {getLabel("nom_personne_fr", t.nom_personne_fr)}
          </label>

          <input
            name="nom_personne_fr"
            value={data.nom_personne_fr || ""}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder={t.nom_personne_fr}
            required
          />

          {formErrors.nom_personne_fr && (
            <p className="text-red-500 text-sm">{formErrors.nom_personne_fr}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {getLabel("prenom_personne_fr", t.prenom_personne_fr)}
          </label>

          <input
            name="prenom_personne_fr"
            value={data.prenom_personne_fr || ""}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder={t.prenom_personne_fr}
            required
          />

          {formErrors.prenom_personne_fr && (
            <p className="text-red-500 text-sm">
              {formErrors.prenom_personne_fr}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {getLabel("nom_personne_ar", t.nom_personne_ar)}
          </label>

          <input
            name="nom_personne_ar"
            value={data.nom_personne_ar || ""}
            onChange={onChange}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-right`}
            placeholder={t.nom_personne_ar}
            required
          />

          {formErrors.nom_personne_ar && (
            <p className="text-red-500 text-sm">{formErrors.nom_personne_ar}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {getLabel("prenom_personne_ar", t.prenom_personne_ar)}
          </label>

          <input
            name="prenom_personne_ar"
            value={data.prenom_personne_ar || ""}
            onChange={onChange}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-right`}
            placeholder={t.prenom_personne_ar}
            required
          />

          {formErrors.prenom_personne_ar && (
            <p className="text-red-500 text-sm">
              {formErrors.prenom_personne_ar}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {getLabel("date_naissance", t.date_naissance)}
          </label>

          <input
            type="date"
            name="date_naissance"
            value={data.date_naissance || ""}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            max={new Date().toISOString().split("T")[0]}
          />

          {formErrors.date_naissance && (
            <p className="text-red-500 text-sm">{formErrors.date_naissance}</p>
          )}
        </div>

        {/* ***********Lieu de naissance ***********************/}

        {interfaceLocale === "fr" && (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              {getLabel("lieu_naissance_fr", t.lieu_naissance_fr)}
            </label>

            <select
              name="lieu_naissance_fr"
              value={data.lieu_naissance_fr || ""}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              disabled={isLoadingWilayas}
              required
            >
              <option value="" disabled>
                {interfaceLocale === "fr"
                  ? "Sélectionnez une wilaya"
                  : "اختر ولاية"}
              </option>

              {wilayas.map((wilaya, index) => (
                <option key={index} value={wilaya.name_fr}>
                  {wilaya.name_fr}
                </option>
              ))}
            </select>

            {formErrors.lieu_naissance_fr && (
              <p className="text-red-500 text-sm">
                {formErrors.lieu_naissance_fr}
              </p>
            )}
          </div>
        )}

        {interfaceLocale === "ar" && (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              {getLabel("lieu_naissance_ar", t.lieu_naissance_ar)}
            </label>

            <select
              name="lieu_naissance_ar"
              value={data.lieu_naissance_ar || ""}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-right"
              disabled={isLoadingWilayas}
              required
            >
              <option value="" disabled>
                {interfaceLocale === "fr"
                  ? "Sélectionnez une wilaya"
                  : "اختر ولاية"}
              </option>

              {wilayas.map((wilaya, index) => (
                <option key={index} value={wilaya.name_ar}>
                  {wilaya.name_ar}
                </option>
              ))}
            </select>

            {formErrors.lieu_naissance_ar && (
              <p className="text-red-500 text-sm">
                {formErrors.lieu_naissance_ar}
              </p>
            )}
          </div>
        )}

        {/* **************FIN LIEU DE NAISSANCE************* */}

        {/* **********ADRESSE PHYSIQUE************* */}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {getLabel("adresse_fr", t.adresse_fr)}
          </label>

          <input
            name="adresse_fr"
            value={data.adresse_fr || ""}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder={t.adresse_fr}
            required
          />

          {formErrors.adresse_fr && (
            <p className="text-red-500 text-sm">{formErrors.adresse_fr}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {getLabel("adresse_ar", t.adresse_ar)}
          </label>

          <input
            name="adresse_ar"
            value={data.adresse_ar || ""}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-right"
            placeholder={t.adresse_ar}
            required
          />

          {formErrors.adresse_ar && (
            <p className="text-red-500 text-sm">{formErrors.adresse_ar}</p>
          )}
        </div>

        {/* **********FIN ADRESSE PHYSIQUE************* */}

        {/* ****************NATIONNALITé****************** */}

        {interfaceLocale === "fr" && (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              {getLabel("nationalite_fr", t.nationalite_fr)}
            </label>

            <input
              name="nationalite_fr"
              value={"Algerienne"}
              disabled
              onChange={onChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder={t.nationalite_fr}
              required
            />

            {formErrors.nationalite_fr && (
              <p className="text-red-500 text-sm">
                {formErrors.nationalite_fr}
              </p>
            )}
          </div>
        )}

        {interfaceLocale === "ar" && (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              {getLabel("nationalite_ar", t.nationalite_ar)}
            </label>

            <input
              name="nationalite_ar"
              value={"جزائرية"}
              disabled
              onChange={onChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-right"
              placeholder={t.nationalite_ar}
              required
            />

            {formErrors.nationalite_ar && (
              <p className="text-red-500 text-sm">
                {formErrors.nationalite_ar}
              </p>
            )}
          </div>
        )}

        {/* ***************FIN NATIONALITE************ */}

        {/* ***********GENRE ************ */}

        {interfaceLocale === "fr" && (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              {getLabel("sexe_personne_fr", t.sexe_personne_fr)}
            </label>

            <select
              name="sexe_personne_fr"
              value={data.sexe_personne_fr || ""}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            >
              <option value="" disabled>
                {interfaceLocale === "fr"
                  ? "Sélectionnez le sexe"
                  : "اختر الجنس"}
              </option>

              <option value="Masculin">Masculin</option>

              <option value="Féminin">Féminin</option>
            </select>

            {formErrors.sexe_personne_fr && (
              <p className="text-red-500 text-sm">
                {formErrors.sexe_personne_fr}
              </p>
            )}
          </div>
        )}

        {interfaceLocale === "ar" && (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              {getLabel("sexe_personne_ar", t.sexe_personne_ar)}
            </label>

            <select
              name="sexe_personne_ar"
              value={data.sexe_personne_ar || ""}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-right"
              required
            >
              <option value="" disabled>
                {interfaceLocale === "fr"
                  ? "Sélectionnez le sexe"
                  : "اختر الجنس"}
              </option>

              <option value="ذكر">ذكر</option>

              <option value="أنثى">أنثى</option>
            </select>

            {formErrors.sexe_personne_ar && (
              <p className="text-red-500 text-sm">
                {formErrors.sexe_personne_ar}
              </p>
            )}
          </div>
        )}

        {/* ***********FIN GENRE ************ */}

        {/* *************TELEPHONE************ */}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {getLabel("num_tlf_personne", t.num_tlf_personne)}
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
                name="num_tlf_personne"
                value={data.num_tlf_personne || ""}
                onChange={onChange}
                onBlur={handlePhoneBlur}
                onKeyPress={(e) => {
                  const charCode = e.charCode;
                  if (charCode < 48 || charCode > 57) {
                    e.preventDefault();
                  }
                }}
                className={`block p-2.5 w-full text-sm text-gray-900 bg-white border border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${interfaceLocale === "ar" ? "text-right rounded-r-lg border-l-0" : "rounded-r-lg border-l-0"}`}
                placeholder={interfaceLocale === "fr" ? "0123456789" : "0123456789"}
                required
                pattern="[0-9]{10}"
                maxLength="10"
              />
            </div>
          </div>

          {formErrors.num_tlf_personne && (
            <p className="text-red-500 text-sm">
              {formErrors.num_tlf_personne}
            </p>
          )}
        </div>

        {/* *********FIN TELEPHONE************* */}

        {/* ***********GROUPAGE SANGUIN ************ */}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {getLabel("groupage", t.groupage)}
          </label>

          <select
            name="groupage"
            value={data.groupage || ""}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          >
            <option value="">{t.groupage}</option>

            <option value="A+">A+</option>

            <option value="A-">A-</option>

            <option value="B+">B+</option>

            <option value="B-">B-</option>

            <option value="AB+">AB+</option>

            <option value="AB-">AB-</option>

            <option value="O+">O+</option>

            <option value="O-">O-</option>
          </select>

          {formErrors.groupage && (
            <p className="text-red-500 text-sm">{formErrors.groupage}</p>
          )}
        </div>

        {/* *********FIN GROUPAGE SANGUIN************* */}
      </div>

      {/* ************UPLODE FICHIERS */}

      <div>
        <label
          className="block mb-2 text-sm font-medium text-gray-900"
          htmlFor="carte_nationale"
        >
          {getLabel("carte_nationale", t.carte_nationale)}
        </label>

        {data.fichiers &&
          data.fichiers.some((f) => f.type === "carte_nationale") && (
            <div className="mb-2">
              <p className="text-sm text-gray-600">
                {interfaceLocale === "fr"
                  ? "Fichier existant :"
                  : "الملف الموجود :"}
                {interfaceLocale === "fr"
                  ? data.fichiers.find((f) => f.type === "carte_nationale").nom_fichier_fr
                  : data.fichiers.find((f) => f.type === "carte_nationale").nom_fichier_ar
                }{" "}
                {/* {
                  data.fichiers.find((f) => f.type === "carte_nationale")
                    .nom_fichier_fr
                }{" "} */}
                <a
                  href={`http://localhost:8000/storage/${data.fichiers.find((f) => f.type === "carte_nationale")
                    .file_path
                    }`}
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
          className={`relative inline-block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus-within:ring-blue-500 focus-within:border-blue-500 w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
            }`}
        >
          <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
            {interfaceLocale === "fr"
              ? "Sélectionner un fichier"
              : "اختر ملفًا"}
          </span>

          <input
            type="file"
            name="carte_nationale"
            onChange={handleCarteNationaleChange}
            accept="application/pdf"
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            required={
              !data.fichiers ||
              !data.fichiers.some((f) => f.type === "carte_nationale")
            }
          />
        </label>

        {selectedCarteNationaleName && (
          <p
            className={`text-sm text-gray-600 mt-2 ${interfaceLocale === "ar" ? "text-right" : ""
              }`}
          >
            {interfaceLocale === "fr"
              ? "Fichier sélectionné :"
              : "الملف المختار :"}{" "}
            {selectedCarteNationaleName}
          </p>
        )}

        {formErrors.carte_nationale && (
          <p className="text-red-500 text-sm">{formErrors.carte_nationale}</p>
        )}
      </div>

      <div>
        <label
          className="block mb-2 text-sm font-medium text-gray-900"
          htmlFor="photo"
        >
          {getLabel("photo", t.photo)}
        </label>

        {data.fichiers && data.fichiers.some((f) => f.type === "photo") && (
          <div className="mb-2">
            <p className="text-sm text-gray-600">
              {interfaceLocale === "fr"
                ? "Fichier existant :"
                : "الملف الموجود :"}
              {interfaceLocale === "fr"
                ? data.fichiers.find((f) => f.type === "photo").nom_fichier_fr
                : data.fichiers.find((f) => f.type === "photo").nom_fichier_ar
              }{" "}
              {/* {data.fichiers.find((f) => f.type === "photo").nom_fichier_fr}{" "} */}
              <a
                href={`http://localhost:8000/storage/${data.fichiers.find((f) => f.type === "photo").file_path
                  }`}
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
          className={`relative inline-block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus-within:ring-blue-500 focus-within:border-blue-500 w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
            }`}
        >
          <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
            {interfaceLocale === "fr"
              ? "Sélectionner un fichier"
              : "اختر ملفًا"}
          </span>

          <input
            type="file"
            name="photo"
            onChange={handlePhotoChange}
            accept="image/jpeg,image/png,image/jpg"
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            required={
              !data.fichiers || !data.fichiers.some((f) => f.type === "photo")
            }
          />
        </label>

        {selectedPhotoName && (
          <p
            className={`text-sm text-gray-600 mt-2 ${interfaceLocale === "ar" ? "text-right" : ""
              }`}
          >
            {interfaceLocale === "fr"
              ? "Fichier sélectionné :"
              : "الملف المختار :"}{" "}
            {selectedPhotoName}
          </p>
        )}

        {formErrors.photo && (
          <p className="text-red-500 text-sm">{formErrors.photo}</p>
        )}
      </div>

      {/* *********FIN UPLODE FICHIERS************* */}

      {/* SUBMIT BUTTON */}

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isFormComplete()}
        >
          {t.next_step}
        </button>
      </div>

      {/* FIN SUBMIT BUTON */}
    </form>
  );
};

export default Step1;
