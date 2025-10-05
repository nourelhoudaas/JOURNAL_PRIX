import React, { useState, useEffect, useCallback, useRef } from "react";

export default function Step3({
  data,
  onChange,
  onFileChange,
  onBack,
  userId,
  themes,
  categories,
  interfaceLocale,
  t,
  direction,
}) {
  const [teamSize, setTeamSize] = useState(data.teamSize || 1);

  const [role, setRole] = useState(data.role || "principal");

  const [collaborators, setCollaborators] = useState(data.collaborators || []);

  const [eligibleUsers, setEligibleUsers] = useState([]);

  const [formErrors, setFormErrors] = useState({});

  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [tempCollaborators, setTempCollaborators] = useState(collaborators);

  const [selectedFiles, setSelectedFiles] = useState(
    data.fichiers?.filter((f) => f.type === "file").map((f) => f.file) || []
  );

  const [certificateFile, setCertificateFile] = useState(null);

  const fileInputRef = useRef(null);

  const certificateInputRef = useRef(null);

  // MODIF: Ajout de la fonction getLabel pour les indicateurs (*) ou (facultatif)

  const getLabel = useCallback(
    (fieldName, isRequired = true) => {
      const baseLabel = t[fieldName] || fieldName; // Fallback si pas de traduction

      return (
        <span className="flex items-center">
          {baseLabel}

          {isRequired ? (
            <span className="text-red-500 ml-1">*</span> // Astérisque avec marge
          ) : (
            <span className="text-gray-500 ml-1">
              {t.facultatif ||
                (interfaceLocale === "fr" ? "(facultatif)" : "(اختياري)")}
            </span> // Texte facultatif avec traduction
          )}
        </span>
      );
    },
    [t, interfaceLocale]
  );

  const validateYouTubeUrl = (url) => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&\n?#]+)/;

    return youtubeRegex.test(url);
  };

  const checkVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");

      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);

        resolve(video.duration <= 13 * 60);
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const isIllustration = useCallback(() => {
    return categories.some(
      (cat) =>
        cat.id_categorie == data.categorie &&
        (cat.nom_categorie_fr.toLowerCase() === "illustration" ||
          cat.nom_categorie_ar.toLowerCase() === "الرسومات التوضيحية")
    );
  }, [data.categorie, categories]);

  const isPress = useCallback(() => {
    return categories.some(
      (cat) =>
        cat.id_categorie == data.categorie &&
        (cat.nom_categorie_fr.toLowerCase() === "presse écrite" ||
          cat.nom_categorie_fr.toLowerCase() === "presse électronique" ||
          cat.nom_categorie_ar.toLowerCase() === "الصحافة المكتوبة" ||
          cat.nom_categorie_ar.toLowerCase() === "الصحافة الإلكترونية")
    );
  }, [data.categorie, categories]);

  const isMedia = useCallback(() => {
    return categories.some(
      (cat) =>
        cat.id_categorie == data.categorie &&
        (cat.nom_categorie_fr.toLowerCase() === "information télévisuelle" ||
          cat.nom_categorie_fr.toLowerCase() === "information radiophonique" ||
          cat.nom_categorie_ar.toLowerCase() === "الإعلام التلفزيوني" ||
          cat.nom_categorie_ar.toLowerCase() === "الإعلام الإذاعي")
    );
  }, [data.categorie, categories]);

  const getCategoryConstraints = useCallback(() => {
    if (isPress()) {
      return {
        maxFiles: 1,

        maxSize: 100 * 1024 * 1024, // 100MB

        allowedMimes: [
          "application/pdf",
          "image/jpeg",
          "image/png",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],

        allowVideoUrl: false,
      };
    } else if (isMedia()) {
      return {
        maxFiles: 1,

        maxSize: 1024 * 1024 * 1024, // 1GB

        allowedMimes: ["video/mp4", "video/avi", "video/quicktime"],

        allowVideoUrl: true,
      };
    } else if (isIllustration()) {
      return {
        maxFiles: 10,

        maxSize: 100 * 1024 * 1024, // 100MB

        allowedMimes: ["image/jpeg", "image/png"],

        allowVideoUrl: false,
      };
    }

    return {
      maxFiles: 1,

      maxSize: 100 * 1024 * 1024, // Default 100MB

      allowedMimes: [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "video/mp4",
        "video/avi",
        "video/quicktime",
      ],

      allowVideoUrl: true,
    };
  }, [isPress, isMedia, isIllustration]);

  useEffect(() => {
    const fetchEligibleCollaborators = async () => {
      if (teamSize > 1 && role === "principal") {
        try {
          const response = await fetch(
            "http://localhost:8000/soumission/membre-collaborators",
            {
              credentials: "include",

              headers: { Accept: "application/json" },
            }
          );

          if (!response.ok)
            throw new Error(t.required.replace(":attribute", t.collaborators));

          const data = await response.json();

          setEligibleUsers(data);
        } catch (err) {
          console.error("Erreur de chargement des collaborateurs :", err);

          setError(t.required.replace(":attribute", t.collaborators));
        }
      } else {
        setEligibleUsers([]);
      }
    };

    fetchEligibleCollaborators();
  }, [teamSize, role, t]);

  useEffect(() => {
    const constraints = getCategoryConstraints();

    if (selectedFiles.length > constraints.maxFiles) {
      setSelectedFiles(selectedFiles.slice(0, constraints.maxFiles));

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (typeof onFileChange === "function") {
        const resetEvent = {
          target: {
            files: selectedFiles.slice(0, constraints.maxFiles),

            name: "file",
          },
        };

        onFileChange(resetEvent);
      }
    }

    if (!constraints.allowVideoUrl && data.video_url) {
      onChange({ target: { name: "video_url", value: "" } });
    }
  }, [
    data.categorie,
    categories,
    selectedFiles,
    onFileChange,
    getCategoryConstraints,
  ]);

  const handlePreviewFile = (file) => {
    if (file && file instanceof File) {
      const fileURL = URL.createObjectURL(file);

      window.open(fileURL, "_blank");

      setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
    } else if (file && file.file instanceof File) {
      const fileURL = URL.createObjectURL(file.file);

      window.open(fileURL, "_blank");

      setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
    } else {
      console.error("Fichier non valide pour la prévisualisation:", file);
    }
  };

  const validateFormErrors = useCallback(() => {
    const errors = {};

    const constraints = getCategoryConstraints();

    if (role === "principal") {
      if (!data.theme) errors.theme = t.required.replace(":attribute", t.theme);

      if (!data.categorie)
        errors.categorie = t.required.replace(":attribute", t.categorie);

      if (!data.titre_oeuvre_fr)
        errors.titre_oeuvre_fr = t.required.replace(
          ":attribute",
          t.titre_oeuvre_fr
        );

      if (!data.titre_oeuvre_ar)
        errors.titre_oeuvre_ar = t.required.replace(
          ":attribute",
          t.titre_oeuvre_ar
        );

      if (!data.descriptif_oeuvre_fr)
        errors.descriptif_oeuvre_fr = t.required.replace(
          ":attribute",
          t.descriptif_oeuvre_fr
        );

      if (!data.descriptif_oeuvre_ar)
        errors.descriptif_oeuvre_ar = t.required.replace(
          ":attribute",
          t.descriptif_oeuvre_ar
        );

      if (!data.date_publication)
        errors.date_publication = t.required.replace(
          ":attribute",
          t.date_publication
        );

      if (teamSize > 1 && collaborators.length !== teamSize - 1) {
        errors.collaborators =
          t.required.replace(":attribute", t.collaborators) +
          ` (${interfaceLocale === "fr" ? "Sélectionnez exactement" : "اختر بالضبط"
          } ${teamSize - 1} ${interfaceLocale === "fr" ? "collaborateurs" : "متعاونين"
          })`;
      }

      if (selectedFiles.length > constraints.maxFiles) {
        errors.file = t.max_files
          .replace(":attribute", t.file)
          .replace(":max", constraints.maxFiles);
      }

      if (data.video_url && selectedFiles.length > 0) {
        errors.file =
          t.file_prohibited_if_url ||
          (interfaceLocale === "fr"
            ? "Vous ne pouvez pas uploader de fichier si une URL vidéo est fournie."
            : "لا يمكنك رفع ملف إذا تم تقديم رابط فيديو.");

        errors.video_url =
          t.url_prohibited_if_file ||
          (interfaceLocale === "fr"
            ? "Vous ne pouvez pas fournir une URL vidéo si un fichier est uploadé."
            : "لا يمكنك تقديم رابط فيديو إذا تم رفع ملف.");
      } else if (!data.video_url && selectedFiles.length === 0) {
        errors.file =
          t.file_or_url_required ||
          (interfaceLocale === "fr"
            ? "Vous devez fournir soit un fichier, soit une URL vidéo."
            : "يجب تقديم إما ملف أو رابط فيديو.");
      }

      if (data.video_url && !constraints.allowVideoUrl) {
        errors.video_url =
          t.video_url_not_allowed ||
          (interfaceLocale === "fr"
            ? "Les URLs YouTube ne sont pas autorisées pour cette catégorie."
            : "روابط يوتيوب غير مسموح بها لهذه الفئة.");
      }

      if (data.video_url && !validateYouTubeUrl(data.video_url)) {
        errors.video_url =
          t.invalid_youtube_url ||
          (interfaceLocale === "fr"
            ? "L'URL YouTube est invalide."
            : "رابط يوتيوب غير صالح.");
      }

      if (!certificateFile) {
        errors.certificate = t.required.replace(
          ":attribute",
          t.certificate || "Certificat de publication"
        );
      } else if (certificateFile.type !== "application/pdf") {
        errors.certificate =
          t.invalid_file_type ||
          (interfaceLocale === "fr"
            ? "Le certificat doit être un fichier PDF."
            : "يجب أن تكون الشهادة ملف PDF.");
      }

      selectedFiles.forEach((file, index) => {
        if (!constraints.allowedMimes.includes(file.type)) {
          errors.file =
            t.invalid_file_type ||
            (interfaceLocale === "fr"
              ? `Le fichier ${file.name} n'est pas d'un type autorisé.`
              : `الملف ${file.name} ليس من نوع مسموح.`);
        }

        if (file.size > constraints.maxSize) {
          errors.file = t.max_file_size
            .replace(":attribute", file.name)
            .replace(":max", constraints.maxSize / (1024 * 1024) + " Mo");
        }
      });
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  }, [
    data,
    t,
    role,
    teamSize,
    collaborators,
    interfaceLocale,
    selectedFiles,
    certificateFile,
    getCategoryConstraints,
  ]);

  const isFormComplete = useCallback(() => {
    if (role !== "principal") return true;

    const constraints = getCategoryConstraints();

    const checks = {
      theme: !!data.theme && themes.some((t) => t.id_theme == data.theme),

      categorie:
        !!data.categorie &&
        categories.some((c) => c.id_categorie == data.categorie),

      titre_oeuvre_fr: !!data.titre_oeuvre_fr,

      titre_oeuvre_ar: !!data.titre_oeuvre_ar,

      descriptif_oeuvre_fr: !!data.descriptif_oeuvre_fr,

      descriptif_oeuvre_ar: !!data.descriptif_oeuvre_ar,

      date_publication: !!data.date_publication,

      collaborators:
        teamSize > 1 ? collaborators.length === teamSize - 1 : true,

      file_or_url:
        (selectedFiles.length > 0 &&
          !data.video_url &&
          selectedFiles.length <= constraints.maxFiles) ||
        (data.video_url &&
          selectedFiles.length === 0 &&
          constraints.allowVideoUrl),

      certificate:
        !!certificateFile && certificateFile.type === "application/pdf",
    };

    return Object.values(checks).every(Boolean);
  }, [
    data,
    themes,
    categories,
    role,
    teamSize,
    collaborators,
    selectedFiles,
    certificateFile,
    getCategoryConstraints,
  ]);

  const handleTeamSizeChange = useCallback(
    (e) => {
      const value = parseInt(e.target.value);

      setTeamSize(value);

      if (value === 1) {
        setCollaborators([]);

        setTempCollaborators([]);

        setRole("principal");

        onChange({ target: { name: "role", value: "principal" } });

        onChange({ target: { name: "collaborators", value: [] } });
      }

      onChange({ target: { name: "teamSize", value } });
    },
    [onChange]
  );

  const handleRoleChange = useCallback(
    (e) => {
      const value = e.target.value;

      setRole(value);

      if (value !== "principal") {
        setCollaborators([]);

        setTempCollaborators([]);

        setFormErrors({});

        setSelectedFiles([]);

        setCertificateFile(null);

        onChange({ target: { name: "collaborators", value: [] } });

        onChange({ target: { name: "fichiers", value: [] } });

        onChange({ target: { name: "titre_oeuvre_fr", value: "" } });

        onChange({ target: { name: "titre_oeuvre_ar", value: "" } });

        onChange({ target: { name: "descriptif_oeuvre_fr", value: "" } });

        onChange({ target: { name: "descriptif_oeuvre_ar", value: "" } });

        onChange({ target: { name: "date_publication", value: "" } });

        onChange({ target: { name: "video_url", value: "" } });
      }

      onChange({ target: { name: "role", value } });
    },
    [onChange]
  );

  const handleVideoUrlChange = (e) => {
    const value = e.target.value;

    if (selectedFiles.length > 0 && value) {
      setFormErrors((prev) => ({
        ...prev,

        video_url:
          t.url_prohibited_if_file ||
          (interfaceLocale === "fr"
            ? "Vous ne pouvez pas fournir une URL vidéo si un fichier est uploadé."
            : "لا يمكنك تقديم رابط فيديو إذا تم رفع ملف."),
      }));

      return;
    }

    setFormErrors((prev) => ({ ...prev, video_url: "" }));

    onChange({ target: { name: "video_url", value } });

    if (value) setSelectedFiles([]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);

    setSelectedFiles(updatedFiles);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    const event = { target: { files: updatedFiles, name: "file" } };

    onFileChange(event);

    // Mettre à jour les erreurs uniquement pour le champ file et video_url

    setFormErrors((prev) => {
      const newErrors = { ...prev };

      if (updatedFiles.length === 0 && !data.video_url) {
        newErrors.file =
          t.file_or_url_required ||
          (interfaceLocale === "fr"
            ? "Vous devez fournir soit un fichier, soit une URL vidéo."
            : "يجب تقديم إما ملف أو رابط فيديو.");
      } else {
        delete newErrors.file;
      }

      if (data.video_url && updatedFiles.length > 0) {
        newErrors.video_url =
          t.url_prohibited_if_file ||
          (interfaceLocale === "fr"
            ? "Vous ne pouvez pas fournir une URL vidéo si un fichier est uploadé."
            : "لا يمكنك تقديم رابط فيديو إذا تم رفع ملف.");
      } else {
        delete newErrors.video_url;
      }

      return newErrors;
    });
  };

  const handleRemoveCertificate = () => {
    setCertificateFile(null);

    if (certificateInputRef.current) {
      certificateInputRef.current.value = "";
    }

    validateFormErrors();
  };

  const handleTempCollaboratorChange = (id) => {
    if (tempCollaborators.includes(id)) {
      setTempCollaborators(tempCollaborators.filter((c) => c !== id));

      setModalError("");
    } else if (tempCollaborators.length < teamSize - 1) {
      setTempCollaborators([...tempCollaborators, id]);

      setModalError("");
    } else {
      setFormErrors((prev) => ({
        ...prev,

        collaborators:
          t.required.replace(":attribute", t.collaborators) +
          ` (${interfaceLocale === "fr" ? "Maximum" : "الحد الأقصى"} ${teamSize - 1
          } ${interfaceLocale === "fr" ? "collaborateurs" : "متعاونين"})`,
      }));
    }
  };

  const handleValidateCollaborators = () => {
    if (tempCollaborators.length !== teamSize - 1) {
      setModalError(
        t.required.replace(":attribute", t.collaborators) +
        ` (${interfaceLocale === "fr" ? "Sélectionnez exactement" : "اختر بالضبط"
        } ${teamSize - 1} ${interfaceLocale === "fr" ? "collaborateurs" : "متعاونين"
        })`
      );

      return;
    }

    setCollaborators(tempCollaborators);

    onChange({ target: { name: "collaborators", value: tempCollaborators } });

    setFormErrors((prev) => ({ ...prev, collaborators: "" }));

    setModalError("");

    setIsModalOpen(false);
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const constraints = getCategoryConstraints();
    const newErrors = {};

    // Vérifier la taille totale cumulative (2 Go = 2 * 1024 * 1024 * 1024 octets)
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const maxTotalSize = 2 * 1024 * 1024 * 1024; // 2 Go

    if (totalSize > maxTotalSize) {
      newErrors.file =
        t.max_total_file_size ||
        (interfaceLocale === "fr"
          ? `La taille totale des fichiers ne doit pas dépasser 2048 Mo.`
          : `يجب ألا يتجاوز الحجم الإجمالي للملفات 2048 ميغابايت.`);
      setFormErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    // Vérifier chaque fichier
    for (const file of files) {
      if (!constraints.allowedMimes.includes(file.type)) {
        newErrors.file =
          t.invalid_file_type ||
          (interfaceLocale === "fr"
            ? `Le fichier ${file.name} n'est pas d'un type autorisé.`
            : `الملف ${file.name} ليس من نوع مسموح.`);
        break;
      }

      if (file.size > constraints.maxSize) {
        newErrors.file = t.max_file_size
          .replace(":attribute", file.name)
          .replace(":max", constraints.maxSize / (1024 * 1024) + " Mo");
        break;
      }

      if (file.type.startsWith("video/")) {
        const isValidDuration = await checkVideoDuration(file);
        if (!isValidDuration) {
          newErrors.file =
            t.max_video_duration ||
            (interfaceLocale === "fr"
              ? "La vidéo ne doit pas dépasser 13 minutes."
              : "يجب ألا تتجاوز المدة 13 دقيقة.");
          break;
        }
      }
    }

    if (Object.keys(newErrors).length === 0) {
      setSelectedFiles(files);
      setFormErrors((prev) => ({ ...prev, file: "" }));
      if (typeof onFileChange === "function") {
        onFileChange(e);
      } else {
        console.error("onFileChange is not a function.");
      }
    } else {
      setFormErrors((prev) => ({ ...prev, ...newErrors }));
    }
  };
  // Debug: Log total size of selected files whenever it changes
  useEffect(() => {
    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    console.log("Total size of selected files:", totalSize);
  }, [selectedFiles]);

  const handleCertificateChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type !== "application/pdf") {
        setFormErrors((prev) => ({
          ...prev,

          certificate:
            t.invalid_file_type ||
            (interfaceLocale === "fr"
              ? "Le certificat doit être un fichier PDF."
              : "يجب أن تكون الشهادة ملف PDF."),
        }));

        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        setFormErrors((prev) => ({
          ...prev,

          certificate: t.max_file_size
            .replace(":attribute", t.certificate)
            .replace(":max", "20 Mo"),
        }));

        return;
      }

      setCertificateFile(file);

      setFormErrors((prev) => ({ ...prev, certificate: "" }));
    }
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateFormErrors()) {
        console.error("Formulaire incomplet.");

        return;
      }

      const form = new FormData();

      form.append("theme", data.theme || "");

      form.append("categorie", data.categorie || "");

      form.append("id_personne", userId || "");

      form.append("taille_equipe", teamSize);

      form.append("role_personne", role);

      form.append("titre_oeuvre_fr", data.titre_oeuvre_fr || "");

      form.append("titre_oeuvre_ar", data.titre_oeuvre_ar || "");

      form.append("descriptif_oeuvre_fr", data.descriptif_oeuvre_fr || "");

      form.append("descriptif_oeuvre_ar", data.descriptif_oeuvre_ar || "");

      form.append("date_publication", data.date_publication || "");

      form.append("video_url", data.video_url || "");

      if (role === "principal") {
        if (selectedFiles.length > 0) {
          selectedFiles.forEach((file, index) => {
            form.append(`files[${index}]`, file);
          });
        }

        if (certificateFile) {
          form.append("certificate", certificateFile);
        }

        if (collaborators.length > 0) {
          collaborators.forEach((id, index) => {
            form.append(`collaborateurs[${index}]`, id);
          });
        }
      }

      try {
        await fetch("http://localhost:8000/sanctum/csrf-cookie", {
          credentials: "include",

          headers: { Accept: "application/json" },
        });

        const token = document.cookie

          .split("; ")

          .find((row) => row.startsWith("XSRF-TOKEN="))

          ?.split("=")[1];

        const response = await fetch("http://localhost:8000/soumission/step3", {
          method: "POST",

          body: form,

          credentials: "include",

          headers: {
            "X-XSRF-TOKEN": decodeURIComponent(token),

            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();

          const errorMessages = errorData.errors
            ? Object.entries(errorData.errors)

              .map(([field, messages]) => {
                return messages
                  .map((msg) => {
                    if (msg.includes("required")) {
                      return (
                        t.required?.replace(
                          ":attribute",
                          t[field] || field
                        ) || `Le champ ${field} est requis.`
                      );
                    }

                    if (msg.includes("regex")) {
                      return (
                        t.invalid_youtube_url ||
                        "L'URL doit être une URL YouTube valide."
                      );
                    }

                    return t[msg] || msg;
                  })
                  .join(" ");
              })

              .join(" ")
            : errorData.error || `Erreur HTTP ${response.status}`;

          setError(errorMessages);

          return;
        }

        const result = await response.json();

        alert(
          result.message ||
          (interfaceLocale === "fr"
            ? "Soumission réussie"
            : "تم الإرسال بنجاح")
        );
      } catch (err) {
        console.error("Erreur lors de la soumission :", err);

        setError(
          t.network_error ||
          (interfaceLocale === "fr"
            ? "Une erreur réseau s'est produite."
            : "حدث خطأ في الشبكة.")
        );
      }
    },
    [
      data,
      userId,
      teamSize,
      role,
      collaborators,
      t,
      interfaceLocale,
      selectedFiles,
      validateFormErrors,
    ]
  );

  const handleCloseModal = () => {
    setIsModalOpen(false);

    setTempCollaborators(collaborators);

    setModalError(""); // MODIF: Correction de la variable (était setModalError, mais non définie ; assumez qu'elle est ajoutée si besoin)
  };

  // MODIF: Ajout de l'état pour modalError (manquant dans le code original)

  const [modalError, setModalError] = useState("");

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-6 w-full max-w-5xl bg-white shadow-md rounded-lg p-8 ${interfaceLocale === "ar" ? "text-right" : ""
        }`}
      dir={direction}
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
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
          {/* MODIF: Application de getLabel pour role (obligatoire) */}

          <label className="block mb-2 text-sm font-medium text-gray-900">
            {getLabel("role", true)}
          </label>

          <select
            name="role"
            value={role}
            onChange={handleRoleChange}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
              }`}
            required
          >
            <option value="">
              {interfaceLocale === "fr" ? "-- Choisir --" : "-- اختر --"}
            </option>

            <option value="principal">
              {interfaceLocale === "fr" ? "Principal" : "رئيسي"}
            </option>

            <option value="collaborateur">
              {interfaceLocale === "fr" ? "Collaborateur" : "متعاون"}
            </option>
          </select>

          {formErrors.role && (
            <p className="text-red-500 text-sm">{formErrors.role}</p>
          )}
        </div>

        {role === "principal" && (
          <div>
            {/* MODIF: Application de getLabel pour teamSize (obligatoire) */}

            <label className="block mb-2 text-sm font-medium text-gray-900">
              {getLabel("teamSize", true)}
            </label>

            <select
              value={teamSize}
              onChange={handleTeamSizeChange}
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
                }`}
              required
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {role === "principal" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {/* MODIF: getLabel pour theme (obligatoire) */}

              <label className="block mb-2 text-sm font-medium text-gray-900">
                {getLabel("theme", true)}
              </label>

              <select
                name="theme"
                value={data.theme || ""}
                onChange={onChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
                  }`}
                required
              >
                <option value="">
                  {interfaceLocale === "fr" ? "-- Choisir --" : "-- اختر --"}
                </option>

                {themes.map((theme) => (
                  <option key={theme.id_theme} value={theme.id_theme}>
                    {interfaceLocale === "ar" ? theme.titre_ar : theme.titre_fr}
                  </option>
                ))}
              </select>

              {formErrors.theme && (
                <p className="text-red-500 text-sm">{formErrors.theme}</p>
              )}
            </div>

            <div>
              {/* MODIF: getLabel pour categorie (obligatoire) */}

              <label className="block mb-2 text-sm font-medium text-gray-900">
                {getLabel("categorie", true)}
              </label>

              <select
                name="categorie"
                value={data.categorie || ""}
                onChange={onChange}
                className={`w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 ${interfaceLocale === "ar" ? "text-right" : ""}`}
              >
                <option value="">{t.select_category || (interfaceLocale === "fr" ? "Sélectionner une catégorie" : "اختر فئة")}</option>
                {categories.map((cat) => (
                  <option key={cat.id_categorie} value={cat.id_categorie}>
                    {interfaceLocale === "fr" ? cat.nom_categorie_fr : cat.nom_categorie_ar}
                  </option>
                ))}
              </select>

              {formErrors.categorie && (
                <p className="text-red-500 text-sm">{formErrors.categorie}</p>
              )}
            </div>

            <div>
              {/* MODIF: getLabel pour titre_oeuvre_fr (obligatoire) */}

              <label className="block mb-2 text-sm font-medium text-gray-900">
                {getLabel("titre_oeuvre_fr", true)}
              </label>

              <input
                type="text"
                name="titre_oeuvre_fr"
                value={data.titre_oeuvre_fr || ""}
                onChange={onChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
                  }`}
                required
              />

              {formErrors.titre_oeuvre_fr && (
                <p className="text-red-500 text-sm">
                  {formErrors.titre_oeuvre_fr}
                </p>
              )}
            </div>

            <div>
              {/* MODIF: getLabel pour titre_oeuvre_ar (obligatoire) */}

              <label className="block mb-2 text-sm font-medium text-gray-900">
                {getLabel("titre_oeuvre_ar", true)}
              </label>

              <input
                type="text"
                name="titre_oeuvre_ar"
                value={data.titre_oeuvre_ar || ""}
                onChange={onChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
                  }`}
                required
              />

              {formErrors.titre_oeuvre_ar && (
                <p className="text-red-500 text-sm">
                  {formErrors.titre_oeuvre_ar}
                </p>
              )}
            </div>

            <div>
              {/* MODIF: getLabel pour descriptif_oeuvre_fr (obligatoire) */}

              <label className="block mb-2 text-sm font-medium text-gray-900">
                {getLabel("descriptif_oeuvre_fr", true)}
              </label>

              <textarea
                name="descriptif_oeuvre_fr"
                value={data.descriptif_oeuvre_fr || ""}
                onChange={onChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
                  }`}
                rows="4"
                required
              />

              {formErrors.descriptif_oeuvre_fr && (
                <p className="text-red-500 text-sm">
                  {formErrors.descriptif_oeuvre_fr}
                </p>
              )}
            </div>

            <div>
              {/* MODIF: getLabel pour descriptif_oeuvre_ar (obligatoire) */}

              <label className="block mb-2 text-sm font-medium text-gray-900">
                {getLabel("descriptif_oeuvre_ar", true)}
              </label>

              <textarea
                name="descriptif_oeuvre_ar"
                value={data.descriptif_oeuvre_ar || ""}
                onChange={onChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
                  }`}
                rows="4"
                required
              />

              {formErrors.descriptif_oeuvre_ar && (
                <p className="text-red-500 text-sm">
                  {formErrors.descriptif_oeuvre_ar}
                </p>
              )}
            </div>

            <div>
              {/* MODIF: getLabel pour date_publication (obligatoire) */}

              <label className="block mb-2 text-sm font-medium text-gray-900">
                {getLabel("date_publication", true)}
              </label>

              <input
                type="date"
                name="date_publication"
                value={data.date_publication || ""}
                onChange={onChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
                  }`}
                required
              />

              {formErrors.date_publication && (
                <p className="text-red-500 text-sm">
                  {formErrors.date_publication}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                {getLabel("video_url", false)}
              </label>

              <input
                type="url"
                name="video_url"
                value={data.video_url || ""}
                onChange={handleVideoUrlChange}
                disabled={
                  selectedFiles.length > 0 ||
                  !getCategoryConstraints().allowVideoUrl
                }
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
                  } ${selectedFiles.length > 0 ||
                    !getCategoryConstraints().allowVideoUrl
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                  }`}
                placeholder={
                  interfaceLocale === "fr"
                    ? "https://www.youtube.com/watch?v=..."
                    : "https://www.youtube.com/watch?v=..."
                }
              />

              <p className="text-sm text-gray-600 mt-1">
                {getCategoryConstraints().allowVideoUrl
                  ? interfaceLocale === "fr"
                    ? "Optionnel individuellement, mais un fichier OU une URL est requis."
                    : "اختياري فرديًا، لكن يجب تقديم ملف أو رابط."
                  : interfaceLocale === "fr"
                    ? "Non autorisé pour cette catégorie."
                    : "غير مسموح لهذه الفئة."}
              </p>

              {formErrors.video_url && (
                <p className="text-red-500 text-sm">{formErrors.video_url}</p>
              )}
            </div>
          </div>

          {teamSize > 1 && (
            // MODIF: Suppression de la console.log mal placée (causait erreur JSX)

            <div>
              {/* MODIF: getLabel pour collaborators (conditionnel, mais traité comme obligatoire si teamSize >1) */}

              <label className="block mb-2 text-sm font-medium text-gray-900">
                {getLabel("collaborators", teamSize > 1)}
              </label>

              {eligibleUsers.length < teamSize - 1 ? (
                <p className="text-sm text-gray-600">
                  {interfaceLocale === "fr"
                    ? "Aucun collaborateur disponible"
                    : "لا يوجد متعاونون متاحون"}
                </p>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setTempCollaborators(collaborators);

                      setIsModalOpen(true);
                    }}
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : "text-left"
                      }`}
                    disabled={eligibleUsers.length === 0}
                  >
                    {interfaceLocale === "fr"
                      ? "Sélectionner les collaborateurs"
                      : "اختر المتعاونين"}
                  </button>

                  {collaborators.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-900">
                        {interfaceLocale === "fr"
                          ? "Collaborateurs sélectionnés :"
                          : "المتعاونون المختارون :"}
                      </p>

                      <ul className="list-disc pl-5 text-sm text-gray-600">
                        {collaborators.map((id) => {
                          const user = eligibleUsers.find(
                            (u) => u.id_personne === id
                          );

                          return user ? (
                            <li key={id}>
                              {interfaceLocale === "ar"
                                ? `${user.nom_personne_ar} ${user.prenom_personne_ar}`
                                : `${user.nom_personne_fr} ${user.prenom_personne_fr}`}
                            </li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {formErrors.collaborators && (
                <p className="text-red-500 text-sm">
                  {formErrors.collaborators}
                </p>
              )}
            </div>
          )}

          {isModalOpen && (
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  handleCloseModal();
                }
              }}
            >
              <div
                className={`bg-white rounded-lg shadow-md w-full max-w-lg p-6 ${interfaceLocale === "ar" ? "text-right" : ""
                  }`}
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {interfaceLocale === "fr" ? "Sélectionner les collaborateurs" : "اختر المتعاونين"}
                </h3>

                <div className="mb-4">
                  {interfaceLocale === "fr" ? (
                    <div className="flex items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus-within:ring-blue-500 focus-within:border-blue-500 w-full p-1">
                      <span className="mr-2 text-xs">{t.search || "Rechercher :"}</span>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t.search_placeholder || "Rechercher..."}
                        className="flex-grow bg-transparent border-none focus:outline-none text-sm"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus-within:ring-blue-500 focus-within:border-blue-500 w-full p-1">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t.search_placeholder || "بحث..."}
                        className="flex-grow bg-transparent border-none focus:outline-none text-sm"
                      />
                      <span className="ml-2 text-xs">{t.search || ":بحث"}</span>
                    </div>
                  )}
                </div>

                <ul
                  className={`w-full py-2 overflow-y-auto text-gray-700 dark:text-gray-200 max-h-[calc(100vh-200px)] ${interfaceLocale === "ar" ? "mr-2" : "ml-2"
                    }`}
                >
                  {eligibleUsers
                    .filter((user) =>
                      (interfaceLocale === "fr"
                        ? `${user.nom_personne_fr} ${user.prenom_personne_fr}`
                        : `${user.nom_personne_ar} ${user.prenom_personne_ar}`
                      )
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((user) => {
                      const photo = user.dossier?.fichiers?.find((f) => f.type === "photo");
                      //const filePath = photo ? photo.file_path.replace(/^photos\//, "") : "";
                      const photoSrc = photo
                        ? `http://localhost:8000/storage/${photo.file_path}`
                        : "/docs/images/people/default-profile.jpg";

                      return (
                        <li key={user.id_personne} className="mb-2">
                          <label
                            className={`flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${tempCollaborators.includes(user.id_personne)
                              ? "bg-blue-100 dark:bg-blue-600 text-blue-800 dark:text-blue-200"
                              : ""
                              } ${interfaceLocale === "ar" ? "justify-start" : "justify-start"}`}
                          >
                            <input
                              type="checkbox"
                              checked={tempCollaborators.includes(user.id_personne)}
                              onChange={() => handleTempCollaboratorChange(user.id_personne)}
                              className="mr-2"
                              disabled={
                                !tempCollaborators.includes(user.id_personne) &&
                                tempCollaborators.length >= teamSize - 1
                              }
                            />
                            <img
                              className={`w-12 h-12 ${interfaceLocale === "ar" ? "ms-2" : "me-2"
                                } rounded-full object-cover`}
                              src={photoSrc}
                              alt={`${interfaceLocale === "ar"
                                ? `${user.nom_personne_ar} ${user.prenom_personne_ar}`
                                : `${user.nom_personne_fr} ${user.prenom_personne_fr}`
                                }`}
                            />
                            <span>
                              {interfaceLocale === "ar"
                                ? `${user.nom_personne_ar} ${user.prenom_personne_ar}`
                                : `${user.nom_personne_fr} ${user.prenom_personne_fr}`}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                </ul>

                {modalError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
                    {modalError}
                  </div>
                )}

                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    {interfaceLocale === "fr" ? "Annuler" : "إلغاء"}
                  </button>
                  <button
                    type="button"
                    onClick={handleValidateCollaborators}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    {interfaceLocale === "fr" ? "Valider" : "تأكيد"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                {getLabel("certificate", true)}
              </label>

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
                  name="certificate"
                  onChange={handleCertificateChange}
                  accept=".pdf"
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  ref={certificateInputRef}
                />
              </label>

              {certificateFile && (
                <div
                  className={`mt-2 ${interfaceLocale === "ar" ? "text-right" : ""
                    }`}
                >
                  <p className="text-sm font-medium text-gray-900">
                    {interfaceLocale === "fr"
                      ? "Certificat sélectionné :"
                      : "الشهادة المختارة :"}
                  </p>

                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    <li>
                      {certificateFile.name}{" "}
                      <button
                        type="button"
                        onClick={() => handlePreviewFile(certificateFile)}
                        className="text-blue-600 hover:underline"
                      >
                        {interfaceLocale === "fr" ? "(Voir)" : "(عرض)"}
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveCertificate}
                        className="text-red-600 hover:underline"
                      >
                        {interfaceLocale === "fr" ? "(Supprimer)" : "(حذف)"}
                      </button>
                    </li>
                  </ul>
                </div>
              )}

              {formErrors.certificate && (
                <p className="text-red-500 text-sm">{formErrors.certificate}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                {getLabel("video_file", false)}
              </label>

              <label
                className={`relative inline-block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus-within:ring-blue-500 focus-within:border-blue-500 w-full p-2.5 ${interfaceLocale === "ar" ? "text-right" : ""
                  } ${data.video_url ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                  {interfaceLocale === "fr"
                    ? isIllustration()
                      ? "Sélectionner des fichiers"
                      : "Sélectionner un fichier/vidéo"
                    : isIllustration()
                      ? "اختر ملفات"
                      : "اختر ملفًا/فيديو"}
                </span>

                <input
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  accept={getCategoryConstraints().allowedMimes.join(",")}
                  disabled={data.video_url}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  multiple={isIllustration()}
                  ref={fileInputRef}
                />
              </label>

              <p className="text-sm text-gray-600 mt-1">
                {data.video_url
                  ? interfaceLocale === "fr"
                    ? "Désactivé car une URL vidéo est fournie."
                    : "معطل لأن رابط فيديو تم تقديمه."
                  : interfaceLocale === "fr"
                    ? `Maximum ${getCategoryConstraints().maxFiles
                    } fichier(s), taille max ${getCategoryConstraints().maxSize / (1024 * 1024)
                    } Mo. Types: ${getCategoryConstraints()
                      .allowedMimes.map((m) => m.split("/")[1])
                      .join(", ")}.`
                    : `الحد الأقصى ${getCategoryConstraints().maxFiles
                    } ملف(ات)، الحجم الأقصى ${getCategoryConstraints().maxSize / (1024 * 1024)
                    } ميغابايت. الأنواع: ${getCategoryConstraints()
                      .allowedMimes.map((m) => m.split("/")[1])
                      .join("، ")}.`}
              </p>

              {selectedFiles.length > 0 && (
                <div
                  className={`mt-2 ${interfaceLocale === "ar" ? "text-right" : ""
                    }`}
                >
                  <p className="text-sm font-medium text-gray-900">
                    {interfaceLocale === "fr"
                      ? "Fichier(s)/Vidéo(s) sélectionné(s) :"
                      : "الملف(ات)/الفيديو(ات) المختار(ة) :"}
                  </p>

                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {selectedFiles.map((file, index) => (
                      <li key={index}>
                        {file.name}{" "}
                        <button
                          type="button"
                          onClick={() => handlePreviewFile(file)}
                          className="text-blue-600 hover:underline"
                        >
                          {interfaceLocale === "fr" ? "(Voir)" : "(عرض)"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-600 hover:underline"
                        >
                          {interfaceLocale === "fr" ? "(Supprimer)" : "(حذف)"}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {formErrors.file && (
                <p className="text-red-500 text-sm">{formErrors.file}</p>
              )}
            </div>
          </>
        </div>
      )}

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
          disabled={!isFormComplete()}
        >
          {interfaceLocale === "fr" ? "Soumettre" : "إرسال"}
        </button>
      </div>
    </form>
  );
}
