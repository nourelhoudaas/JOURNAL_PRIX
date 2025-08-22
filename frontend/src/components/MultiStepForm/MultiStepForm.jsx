import React, { useState, useEffect } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

export default function MultiStepForm({ interfaceLocale, setInterfaceLocale, direction }) {
  const [currentLocale, setCurrentLocale] = useState(interfaceLocale || "fr");
  const [step, setStep] = useState(1);

  // Synchroniser currentLocale avec la prop interfaceLocale
  useEffect(() => {
    setCurrentLocale(interfaceLocale);
  }, [interfaceLocale]);

  const [step1Data, setStep1Data] = useState({
    id_nin_personne: "",
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
  });

  const [formData, setFormData] = useState({
    userId: null,
    themes: [],
    categories: [],
    id_professional_card: "",
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
    fichiers: [],
    titre_oeuvre_fr: "",
    titre_oeuvre_ar: "",
    descriptif_oeuvre_fr: "",
    descriptif_oeuvre_ar: "",
    date_publication: "",
    video_url: "",
  });

  const [wilayas, setWilayas] = useState([]);
  const [error, setError] = useState("");
  const [wilayasError, setWilayasError] = useState("");
  const [isLoadingWilayas, setIsLoadingWilayas] = useState(true);
  const [isProfessionalCardValidated, setIsProfessionalCardValidated] = useState(false);

  // Définir les traductions
  const translations = {
    fr: {
      id_nin_personne: "Numéro NIN",
      nom_personne_fr: "Nom (FR)",
      prenom_personne_fr: "Prénom (FR)",
      nom_personne_ar: "Nom (AR)",
      prenom_personne_ar: "Prénom (AR)",
      date_naissance: "Date de naissance",
      lieu_naissance_fr: "Lieu de naissance (FR)",
      lieu_naissance_ar: "Lieu de naissance (AR)",
      sexe_personne_fr: "Sexe (FR)",
      sexe_personne_ar: "Sexe (AR)",
      nationalite_fr: "Nationalité (FR)",
      nationalite_ar: "Nationalité (AR)",
      num_tlf_personne: "Téléphone",
      adresse_fr: "Adresse (FR)",
      adresse_ar: "Adresse (AR)",
      groupage: "Groupe sanguin",
      carte_nationale: "Carte nationale",
      photo: "Photo",
      id_professional_card: "Numéro de carte professionnelle",
      num_attes: "Référence attestation de travail",
      fonction_fr: "Fonction (FR)",
      fonction_ar: "الوظيفة (AR)",
      secteur_travail: "Secteur de travail",
      categorie: "Catégorie",
      theme: "Thème",
      collaborators: "Collaborateurs",
      type_media: "Type de média",
      teamSize: "Taille de l'équipe",
      role: "Rôle",
      file: "Fichier(s) oeuvre(s)",
      video_file: "Vidéo",
      tv: "Type de TV",
      radio: "Type de radio",
      media: "Type de média écrit",
      langue: "Langue de l'établissement",
      specialite: "Spécialité",
      nom_etablissement: "Nom de l'établissement (FR)",
      nom_etablissement_ar: "اسم المؤسسة (AR)",
      email: "Email de l'établissement",
      tel: "Téléphone de l'établissement",
      attestation_travail: "Attestation de travail",
      titre_oeuvre_fr: "Titre de l'œuvre (FR)",
      titre_oeuvre_ar: "Titre de l'œuvre (AR)",
      descriptif_oeuvre_fr: "Descriptif de l'œuvre (FR)",
      descriptif_oeuvre_ar: "Descriptif de l'œuvre (AR)",
      date_publication: "Date de publication",
      video_url: "URL de la vidéo YouTube",
      required: "Le champ :attribute est requis.",
      nin_invalid: "Le numéro NIN doit contenir 18 chiffres.",
      phone_invalid: "Le numéro de téléphone doit contenir entre 8 et 15 chiffres.",
      email_invalid: "L'email est invalide ou requis.",
      professional_card_required: "Le numéro de carte professionnelle est requis.",
      professional_card_exists: "Cette carte professionnelle appartient déjà à une autre personne.",
      professional_card_found: "Carte professionnelle trouvée. Vous pouvez modifier les données.",
      new_professional_card: "Nouvelle carte professionnelle. Veuillez remplir les informations.",
      error_check_professional_card: "Erreur lors de la vérification de la carte professionnelle.",
      invalid_category: "La catégorie est requise et doit être 'Média audio' ou 'Média écrit et électronique'.",
      invalid_media_type: "Le type de média est requis et doit être 'TV' ou 'Radio'.",
      invalid_tv_type: "Le type de TV est requis et doit être 'Régionale' ou 'Nationale'.",
      invalid_radio_type: "Le type de radio est requis et doit être 'Publique' ou 'Locale'.",
      invalid_written_media_type: "Le type de média écrit est requis et doit être 'Écrit' ou 'Électronique'.",
      invalid_category_private: "La catégorie doit être 'Privé' pour le secteur privé.",
      invalid_media_type_private: "Le type de média doit être 'Privé' pour le secteur privé.",
      max_video_size: "La taille de la vidéo ne doit pas dépasser 100 Mo.",
      max_video_duration: "La durée de la vidéo ne doit pas dépasser 13 minutes.",
      invalid_youtube_url: "L'URL doit être une URL YouTube valide.",
      video_or_url_required: "Vous devez fournir soit une vidéo, soit une URL YouTube, mais pas les deux.",
      next_step: "Étape suivante →",
      prev_step: "← Étape précédente",
    },
    ar: {
      id_nin_personne: "رقم الهوية الوطنية",
      nom_personne_fr: "الاسم (فرنسي)",
      prenom_personne_fr: "اللقب (فرنسي)",
      nom_personne_ar: "الاسم (عربي)",
      prenom_personne_ar: "اللقب (عربي)",
      date_naissance: "تاريخ الميلاد",
      lieu_naissance_fr: "مكان الولادة (فرنسي)",
      lieu_naissance_ar: "مكان الولادة (عربي)",
      sexe_personne_fr: "الجنس (فرنسي)",
      sexe_personne_ar: "الجنس (عربي)",
      nationalite_fr: "الجنسية (فرنسي)",
      nationalite_ar: "الجنسية (عربي)",
      num_tlf_personne: "الهاتف",
      adresse_fr: "العنوان (فرنسي)",
      adresse_ar: "العنوان (عربي)",
      groupage: "فصيلة الدم",
      carte_nationale: "البطاقة الوطنية",
      photo: "الصورة",
      id_professional_card: "رقم البطاقة المهنية",
      num_attes: "رقم شهادة العمل",
      fonction_fr: "الوظيفة (فرنسي)",
      fonction_ar: "الوظيفة (عربي)",
      secteur_travail: "قطاع العمل",
      categorie: "الفئة",
      theme: "الموضوع",
      collaborators: "المتعاونون",
      type_media: "نوع الوسائط",
      teamSize: "حجم الفريق",
      role: "الدور",
      file: "الملف(ات) العمل",
      video_file: "الفيديو",
      tv: "نوع التلفزيون",
      radio: "نوع الراديو",
      media: "نوع الوسائط المكتوبة",
      langue: "لغة المؤسسة",
      specialite: "التخصص",
      nom_etablissement: "اسم المؤسسة (فرنسي)",
      nom_etablissement_ar: "اسم المؤسسة (عربي)",
      email: "البريد الإلكتروني للمؤسسة",
      tel: "هاتف المؤسسة",
      attestation_travail: "شهادة العمل",
      titre_oeuvre_fr: "عنوان العمل (فرنسي)",
      titre_oeuvre_ar: "عنوان العمل (عربي)",
      descriptif_oeuvre_fr: "وصف العمل (فرنسي)",
      descriptif_oeuvre_ar: "وصف العمل (عربي)",
      date_publication: "تاريخ النشر",
      video_url: "رابط فيديو يوتيوب",
      required: "الحقل :attribute مطلوب.",
      nin_invalid: "رقم الهوية الوطنية يجب أن يحتوي على 18 رقمًا.",
      phone_invalid: "رقم الهاتف يجب أن يحتوي على ما بين 8 و15 أرقام.",
      email_invalid: "البريد الإلكتروني غير صالح أو مطلوب.",
      professional_card_required: "رقم البطاقة المهنية مطلوب.",
      professional_card_exists: "هذه البطاقة المهنية تخص شخصًا آخر بالفعل.",
      professional_card_found: "تم العثور على البطاقة المهنية. يمكنك تعديل البيانات.",
      new_professional_card: "بطاقة مهنية جديدة. يرجى ملء المعلومات.",
      error_check_professional_card: "خطأ أثناء التحقق من البطاقة المهنية.",
      invalid_category: "الفئة مطلوبة ويجب أن تكون 'وسائط صوتية' أو 'وسائط مكتوبة وإلكترونية'.",
      invalid_media_type: "نوع الوسائط مطلوب ويجب أن يكون 'تلفزيون' أو 'راديو'.",
      invalid_tv_type: "نوع التلفزيون مطلوب ويجب أن يكون 'إقليمي' أو 'وطني'.",
      invalid_radio_type: "نوع الراديو مطلوب ويجب أن يكون 'عمومي' أو 'محلي'.",
      invalid_written_media_type: "نوع الوسائط المكتوبة مطلوب ويجب أن يكون 'مكتوب' أو 'إلكتروني'.",
      invalid_category_private: "يجب أن تكون الفئة 'خاص' للقطاع الخاص.",
      invalid_media_type_private: "يجب أن يكون نوع الوسائط 'خاص' للقطاع الخاص.",
      max_video_size: "حجم الفيديو يجب ألا يتجاوز 100 ميغابايت.",
      max_video_duration: "مدة الفيديو يجب ألا تتجاوز 13 دقيقة.",
      invalid_youtube_url: "الرابط يجب أن يكون رابط يوتيوب صالح.",
      video_or_url_required: "يجب تقديم إما فيديو أو رابط يوتيوب، وليس كلاهما.",
      next_step: "الخطوة التالية ←",
      prev_step: "→ الخطوة السابقة",
    },
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8000/profile", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("Erreur d'authentification");
      } catch (error) {
        console.error("❌ Erreur d'authentification :", error);
        setError(
          translations[currentLocale].required.replace(
            ":attribute",
            "authentification"
          )
        );
      }
    };
    checkAuth();
  }, [currentLocale]);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch("http://localhost:8000/form-data", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("Erreur données");
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          userId: data.userId,
          themes: data.themes || [],
          categories: data.categories || [],
        }));
      } catch (error) {
        console.error("❌ Erreur chargement des données :", error);
        setError(
          translations[currentLocale].required.replace(
            ":attribute",
            "données du formulaire"
          )
        );
      }
    };
    fetchFormData();
  }, [currentLocale]);

  useEffect(() => {
    const fetchWilayas = async () => {
      try {
        setIsLoadingWilayas(true);
        const response = await fetch("http://localhost:8000/wilayas", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        if (!response.ok) {
          throw new Error(
            `Erreur HTTP ${response.status}: ${response.statusText}`
          );
        }
        const data = await response.json();
        setWilayas(data);
        setWilayasError("");
        setIsLoadingWilayas(false);
      } catch (error) {
        console.error("❌ Erreur chargement des wilayas :", error);
        setWilayasError(
          translations[currentLocale].required.replace(":attribute", "wilayas")
        );
        setIsLoadingWilayas(false);
      }
    };
    fetchWilayas();
  }, [currentLocale]);

  const handleStep1Change = (e) => {
    if (e.target.name === "batch") {
      setStep1Data((prev) => ({
        ...prev,
        ...e.target.value,
      }));
    } else {
      const { name, value } = e.target;
      setStep1Data((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
  };

  const handleStep2Change = (e) => {
    if (e.target.name === "batch") {
      setFormData((prev) => ({
        ...prev,
        ...e.target.value,
      }));
    } else {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "secteur_travail" && value === "Privé"
          ? { categorie: "Privé" }
          : {}),
        ...(name === "secteur_travail" && value === "Public"
          ? { categorie: "" }
          : {}),
      }));
    }
    setError("");
    setIsProfessionalCardValidated(false);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      // Vérification de la taille pour carte_nationale et photo (étape 1)
      if (name === "carte_nationale" && files[0].size > 10 * 1024 * 1024) {
        setError(
          translations[currentLocale].required.replace(
            ":attribute",
            "carte nationale (taille max 10 Mo)"
          )
        );
        return;
      }
      if (name === "photo" && files[0].size > 5 * 1024 * 1024) {
        setError(
          translations[currentLocale].required.replace(
            ":attribute",
            "photo (taille max 5 Mo)"
          )
        );
        return;
      }
      if (name === "attestation_travail" && files[0].size > 10 * 1024 * 1024) {
        setError(
          translations[currentLocale].required.replace(
            ":attribute",
            "attestation de travail (taille max 10 Mo)"
          )
        );
        return;
      }
      if (name === "file") {
        // Vérification de la taille pour chaque fichier/vidéo (max 100 Mo pour l'étape 3)
        const maxSize = 100 * 1024 * 1024; // 100 Mo
        for (let i = 0; i < files.length; i++) {
          if (files[i].size > maxSize) {
            setError(
              translations[currentLocale].max_video_size.replace(
                ":attribute",
                `fichier ${files[i].name}`
              )
            );
            return;
          }
        }
        // Stocker les fichiers dans formData.fichiers
        setFormData((prev) => ({
          ...prev,
          fichiers: Array.from(files).map((file) => ({ type: "file", file })),
        }));
      } else if (name === "carte_nationale" || name === "photo") {
        setStep1Data((prev) => ({ ...prev, [name]: files[0] }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
      }
      setError("");
    }
  };

  const handleStep3Change = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateStep1 = () => {
    if (!step1Data.id_nin_personne) {
      setError(
        translations[currentLocale].required.replace(
          ":attribute",
          translations[currentLocale].id_nin_personne
        )
      );
      return false;
    }
    if (step1Data.id_nin_personne.length !== 18) {
      setError(translations[currentLocale].nin_invalid);
      return false;
    }
    if (!/^[0-9]{18}$/.test(step1Data.id_nin_personne)) {
      setError(translations[currentLocale].nin_invalid);
      return false;
    }
    if (!step1Data.nom_personne_fr) {
      setError(
        translations[currentLocale].required.replace(
          ":attribute",
          translations[currentLocale].nom_personne_fr
        )
      );
      return false;
    }
    if (!step1Data.prenom_personne_fr) {
      setError(
        translations[currentLocale].required.replace(
          ":attribute",
          translations[currentLocale].prenom_personne_fr
        )
      );
      return false;
    }
    if (!step1Data.nom_personne_ar) {
      setError(
        translations[currentLocale].required.replace(
          ":attribute",
          translations[currentLocale].nom_personne_ar
        )
      );
      return false;
    }
    if (!step1Data.prenom_personne_ar) {
      setError(
        translations[currentLocale].required.replace(
          ":attribute",
          translations[currentLocale].prenom_personne_ar
        )
      );
      return false;
    }
    if (!step1Data.date_naissance) {
      setError(
        translations[currentLocale].required.replace(
          ":attribute",
          translations[currentLocale].date_naissance
        )
      );
      return false;
    }
    if (!step1Data.lieu_naissance_fr) {
      setError(
        translations[currentLocale].required.replace(
          ":attribute",
          translations[currentLocale].lieu_naissance_fr
        )
      );
      return false;
    }
    if (!step1Data.lieu_naissance_ar) {
      setError(
        translations[currentLocale].required.replace(
          ":attribute",
          translations[currentLocale].lieu_naissance_ar
        )
      );
      return false;
    }
    if (!step1Data.nationalite_fr) {
      setError(
        translations[currentLocale].required.replace(
          ":attribute",
          translations[currentLocale].nationalite_fr
        )
      );
      return false;
    }
    if (!step1Data.nationalite_ar) {
      setError(
        translations[currentLocale].required.replace(
          ":attribute",
          translations[currentLocale].nationalite_ar
        )
      );
      return false;
    }
    if (
      !step1Data.num_tlf_personne ||
      !/^[0-9]{10}$/.test(step1Data.num_tlf_personne)
    ) {
      setError(translations[currentLocale].phone_invalid);
      return false;
    }
    if (!step1Data.adresse_fr) {
      setError(
        translations[currentLocale].required.replace(
          ":attribute",
          translations[currentLocale].adresse_fr
        )
      );
      return false;
    }
    if (!step1Data.adresse_ar) {
      setError(
        translations[currentLocale].required.replace(
          ":attribute",
          translations[currentLocale].adresse_ar
        )
      );
      return false;
    }
    if (!step1Data.sexe_personne_fr) {
      setError(
        translations[currentLocale].required.replace(
          ":attribute",
          translations[currentLocale].sexe_personne_fr
        )
      );
      return false;
    }
    if (!step1Data.sexe_personne_ar) {
      setError(
        translations[currentLocale].required.replace(
          ":attribute",
          translations[currentLocale].sexe_personne_ar
        )
      );
      return false;
    }
    if (!step1Data.groupage) {
      setError(
        translations[currentLocale].required.replace(
          ":attribute",
          translations[currentLocale].groupage
        )
      );
      return false;
    }
    if (
      !step1Data.carte_nationale &&
      (!step1Data.fichiers ||
        !step1Data.fichiers.some((f) => f.type === "carte_nationale"))
    ) {
      setError(
        translations[currentLocale].required.replace(
          ":attribute",
          translations[currentLocale].carte_nationale
        )
      );
      return false;
    }
    if (
      !step1Data.photo &&
      (!step1Data.fichiers ||
        !step1Data.fichiers.some((f) => f.type === "photo"))
    ) {
      setError(
        translations[currentLocale].required.replace(
          ":attribute",
          translations[currentLocale].photo
        )
      );
      return false;
    }
    return true;
  };

  const validateStep2 = async () => {
    if (!formData.id_professional_card) {
      setError(
        translations[currentLocale].required.replace(
          ":attribute",
          "numéro de carte professionnelle"
        )
      );
      return false;
    }
    return true;
  };

  const nextStep = async (e) => {
    if (e) e.preventDefault();
    setError("");
    if (step === 1) {
      if (!validateStep1()) return;
      const form = new FormData();
      for (const key in step1Data) {
        if (
          step1Data[key] !== null &&
          step1Data[key] !== undefined &&
          step1Data[key] !== "" &&
          key !== "fichiers"
        ) {
          form.append(key, step1Data[key]);
        }
      }
      form.append("locale", currentLocale);
      try {
        await fetch("http://localhost:8000/sanctum/csrf-cookie", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("XSRF-TOKEN="))
          ?.split("=")[1];
        const res = await fetch("http://localhost:8000/soumission/step1", {
          method: "POST",
          body: form,
          credentials: "include",
          headers: {
            "X-XSRF-TOKEN": decodeURIComponent(token),
            Accept: "application/json",
          },
        });
        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.error || `Erreur HTTP ${res.status}`);
          return;
        }
        const result = await res.json();
        setFormData((prev) => ({
          ...prev,
          userId: result.id_personne || prev.userId,
        }));
        setError("");
        setStep(2);
      } catch (error) {
        console.error("Erreur fetch :", error);
        setError(
          error.message ||
            translations[currentLocale].required.replace(":attribute", "soumission")
        );
      }
    } else if (step === 2) {
      if (!validateStep2()) return;
      const form = new FormData();
      for (const key in formData) {
        if (
          formData[key] !== null &&
          formData[key] !== undefined &&
          formData[key] !== "" &&
          key !== "fichiers"
        ) {
          form.append(key, formData[key]);
        }
      }
      form.append("type_media", formData.type_media || "");
      form.append("locale", currentLocale);
      try {
        await fetch("http://localhost:8000/sanctum/csrf-cookie", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("XSRF-TOKEN="))
          ?.split("=")[1];
        const res = await fetch("http://localhost:8000/soumission/step2", {
          method: "POST",
          body: form,
          credentials: "include",
          headers: {
            "X-XSRF-TOKEN": decodeURIComponent(token),
            Accept: "application/json",
          },
        });
        if (!res.ok) {
          const errorData = await res.json();
          const errorMessages = errorData.errors
            ? Object.values(errorData.errors).flat().join(" ")
            : errorData.error || `Erreur HTTP ${res.status}`;
          setError(errorMessages);
          return;
        }
        setError("");
        setStep(3);
      } catch (error) {
        console.error("Erreur fetch :", error);
        setError(
          error.message ||
            translations[currentLocale].required.replace(":attribute", "soumission")
        );
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col pt-8"
      dir={direction}
      style={{ direction: direction }}
    >
      <div className="flex-grow flex flex-col items-center justify-start p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <ol
              className={`flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base ${direction === "rtl" ? "flex-row-reverse space-x-reverse space-x-6" : "flex-row space-x-6"}`}
              style={{ direction: direction === "rtl" ? "rtl !important" : "ltr" }}
            >
              <li
                className={`${interfaceLocale === "ar"
                    ? "flex items-center"
                    : "flex md:w-full items-center sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mr-8 xl:after:mr-12 dark:after:border-gray-700"
                  } ${step === 1 || step > 1 ? "text-blue-600 dark:text-blue-500" : ""}`}
              >
                <span
                  className={`flex items-center after:content-['/'] sm:after:hidden ${direction === "rtl" ? "after:mr-3" : "after:ml-3"} after:text-gray-200 dark:after:text-gray-500`}
                >
                  {interfaceLocale === "ar" ? (
                    <>
                      {interfaceLocale === "fr" ? "Informations Personnelles" : "المعلومات الشخصية"}
                      <span className={direction === "rtl" ? "ml-3" : "mr-3"}>1</span>
                    </>
                  ) : (
                    <>
                      <span className={direction === "rtl" ? "ml-3" : "mr-3"}>1</span>
                      {interfaceLocale === "fr" ? "Informations Personnelles" : "المعلومات الشخصية"}
                    </>
                  )}
                  {step > 1 ? (
                    <svg
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${direction === "rtl" ? "ml-3" : "mr-3"}`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                  ) : null}
                </span>
              </li>
              <li
                className={`flex md:w-full items-center ${step === 2 || step > 2 ? "text-blue-600 dark:text-blue-500" : ""} sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block ${direction === "rtl" ? "after:mr-8 xl:after:mr-12" : "after:ml-8 xl:after:ml-12"} dark:after:border-gray-700`}
              >
                <span
                  className={`flex items-center after:content-['/'] sm:after:hidden ${direction === "rtl" ? "after:mr-3" : "after:ml-3"} after:text-gray-200 dark:after:text-gray-500`}
                >
                  {interfaceLocale === "ar" ? (
                    <>
                      {interfaceLocale === "fr" ? "Compte Info" : "معلومات الحساب"}
                      <span className={direction === "rtl" ? "ml-3" : "mr-3"}>2</span>
                    </>
                  ) : (
                    <>
                      <span className={direction === "rtl" ? "ml-3" : "mr-3"}>2</span>
                      {interfaceLocale === "fr" ? "Compte Info" : "معلومات الحساب"}
                    </>
                  )}
                  {step > 2 ? (
                    <svg
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${direction === "rtl" ? "ml-3" : "mr-3"}`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                  ) : null}
                </span>
              </li>
              <li
                className={`${interfaceLocale === "ar"
                    ? "flex md:w-full items-center sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mr-8 xl:after:mr-12 dark:after:border-gray-700"
                    : "flex items-center"
                  } ${step === 3 ? "text-blue-600 dark:text-blue-500" : ""}`}
              >
                <span
                  className={`flex items-center ${direction === "rtl" ? "after:mr-3" : "after:ml-3"} after:content-['/'] sm:after:hidden after:text-gray-200 dark:after:text-gray-500`}
                >
                  {interfaceLocale === "ar" ? (
                    <>
                      {interfaceLocale === "fr" ? "Confirmation" : "التأكيد"}
                      <span className={direction === "rtl" ? "ml-3" : "mr-3"}>3</span>
                    </>
                  ) : (
                    <>
                      <span className={direction === "rtl" ? "ml-3" : "mr-3"}>3</span>
                      {interfaceLocale === "fr" ? "Confirmation" : "التأكيد"}
                    </>
                  )}
                  {step > 3 ? (
                    <svg
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${direction === "rtl" ? "ml-3" : "mr-3"}`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                  ) : null}
                </span>
              </li>
            </ol>
          </div>
          <div>{renderStepContent()}</div>
        </div>
      </div>
    </div>
  );

  function renderStepContent() {
    const t = translations[currentLocale] || translations.fr; // Valeur par défaut si undefined
    //console.log('MultiStepForm - interfaceLocale:', currentLocale, 't:', t);
    switch (step) {
      case 1:
        return (
          <Step1
            data={step1Data}
            onChange={handleStep1Change}
            onFileChange={handleFileChange}
            onNext={nextStep}
            error={error || wilayasError}
            wilayas={wilayas}
            isLoadingWilayas={isLoadingWilayas}
            interfaceLocale={currentLocale}
            t={t}
            direction={direction}
          />
        );
      case 2:
        return (
          <Step2
            data={formData}
            onChange={handleStep2Change}
            onFileChange={handleFileChange}
            onCheckProfessionalCard={validateStep2}
            onNext={nextStep}
            onBack={prevStep}
            error={error}
            setIsProfessionalCardValidated={setIsProfessionalCardValidated}
            interfaceLocale={currentLocale}
            t={t}
            direction={direction}
          />
        );
      case 3:
        return (
          <Step3
            data={formData}
            onChange={handleStep3Change}
            onFileChange={handleFileChange}
            onBack={prevStep}
            userId={formData.userId}
            themes={formData.themes}
            categories={formData.categories}
            interfaceLocale={currentLocale}
            t={t}
            direction={direction}
          />
        );
      default:
        return (
          <div className="text-center text-green-600 text-xl font-bold">
            {currentLocale === "fr" ? "✅ Formulaire terminé !" : "✅ اكتمل النموذج !"}
          </div>
        );
    }
  }
}