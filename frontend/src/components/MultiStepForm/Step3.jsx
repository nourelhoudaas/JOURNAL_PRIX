import React, { useState, useEffect, useCallback, useRef } from 'react';

export default function Step3({ data, onChange, onFileChange, onBack, userId, themes, categories, interfaceLocale, t, direction }) {
  const [teamSize, setTeamSize] = useState(data.teamSize || 1);
  const [role, setRole] = useState(data.role || 'principal');
  const [collaborators, setCollaborators] = useState(data.collaborators || []);
  const [eligibleUsers, setEligibleUsers] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempCollaborators, setTempCollaborators] = useState(collaborators);
  const [selectedFiles, setSelectedFiles] = useState(data.fichiers?.filter(f => f.type === 'file').map(f => f.file) || []);
  const [modalError, setModalError] = useState('');
  const fileInputRef = useRef(null);

  const validateYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&\n?#]+)/;
    return youtubeRegex.test(url);
  };

  const checkVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration <= 13 * 60); // 13 minutes en secondes
      };
      video.src = URL.createObjectURL(file);
    });
  };

  useEffect(() => {
    const fetchEligibleCollaborators = async () => {
      if (teamSize > 1 && role === 'principal') {
        try {
          const response = await fetch('http://localhost:8000/soumission/membre-collaborators', {
            credentials: 'include',
            headers: { Accept: 'application/json' },
          });
          if (!response.ok) throw new Error(t.required.replace(':attribute', t.collaborators));
          const data = await response.json();
          setEligibleUsers(data);
          console.log('Fetched Eligible Users:', data);
        } catch (err) {
          console.error('Erreur de chargement des collaborateurs :', err);
          setError(t.required.replace(':attribute', t.collaborators));
        }
      } else {
        setEligibleUsers([]);
      }
    };
    fetchEligibleCollaborators();
  }, [teamSize, role, t]);

  useEffect(() => {
    const isIllustration = categories.some(cat =>
      cat.id_categorie == data.categorie &&
      (cat.nom_categorie_fr.toLowerCase() === 'illustration' || cat.nom_categorie_ar.toLowerCase() === 'الرسومات التوضيحية')
    );
    const maxFiles = isIllustration ? 10 : 1;
    if (selectedFiles.length > maxFiles) {
      setSelectedFiles(selectedFiles.slice(0, maxFiles));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (typeof onFileChange === 'function') {
        const resetEvent = {
          target: {
            files: selectedFiles.slice(0, maxFiles),
            name: 'file',
          },
        };
        onFileChange(resetEvent);
      }
    }
  }, [data.categorie, categories, selectedFiles, onFileChange]);

  const handlePreviewFile = (file) => {
    if (file && file instanceof File) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
      setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
    } else if (file && file.file instanceof File) {
      const fileURL = URL.createObjectURL(file.file);
      window.open(fileURL, '_blank');
      setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
    } else {
      console.error('Fichier non valide pour la prévisualisation:', file);
    }
  };

  const validateFormErrors = useCallback(() => {
    const errors = {};
    if (role === 'principal') {
      if (!data.theme) {
        errors.theme = t.required.replace(':attribute', t.theme);
      }
      if (!data.categorie) {
        errors.categorie = t.required.replace(':attribute', t.categorie);
      }
      if (!data.titre_oeuvre_fr) {
        errors.titre_oeuvre_fr = t.required.replace(':attribute', t.titre_oeuvre_fr);
      }
      if (!data.titre_oeuvre_ar) {
        errors.titre_oeuvre_ar = t.required.replace(':attribute', t.titre_oeuvre_ar);
      }
      if (!data.descriptif_oeuvre_fr) {
        errors.descriptif_oeuvre_fr = t.required.replace(':attribute', t.descriptif_oeuvre_fr);
      }
      if (!data.descriptif_oeuvre_ar) {
        errors.descriptif_oeuvre_ar = t.required.replace(':attribute', t.descriptif_oeuvre_ar);
      }
      if (!data.date_publication) {
        errors.date_publication = t.required.replace(':attribute', t.date_publication);
      }
      if (teamSize > 1 && collaborators.length !== teamSize - 1) {
        errors.collaborators = t.required.replace(':attribute', t.collaborators) + ` (${interfaceLocale === 'fr' ? 'Sélectionnez exactement' : 'اختر بالضبط'} ${teamSize - 1} ${interfaceLocale === 'fr' ? 'collaborateurs' : 'متعاونين'})`;
      }
      const isIllustration = categories.some(cat =>
        cat.id_categorie == data.categorie &&
        (cat.nom_categorie_fr.toLowerCase() === 'illustration' || cat.nom_categorie_ar.toLowerCase() === 'الرسومات التوضيحية')
      );
      const totalFiles = selectedFiles.length;
      if (isIllustration) {
        if (totalFiles === 0 && !data.video_url) {
          errors.file = t.video_or_url_required;
        } else if (totalFiles > 0 && data.video_url) {
          errors.file = t.video_or_url_required;
        } else if (totalFiles > 10) {
          errors.file = t.required.replace(':attribute', t.file) + ` (${interfaceLocale === 'fr' ? 'Maximum 10 fichiers' : 'الحد الأقصى 10 ملفات'})`;
        }
      } else {
        if (totalFiles === 0 && !data.video_url) {
          errors.file = t.video_or_url_required;
        } else if (totalFiles > 1) {
          errors.file = t.required.replace(':attribute', t.file) + ` (${interfaceLocale === 'fr' ? 'Maximum 1 fichier' : 'الحد الأقصى 1 ملف'})`;
        } else if (totalFiles > 0 && data.video_url) {
          errors.file = t.video_or_url_required;
        }
      }
      if (data.video_url && !validateYouTubeUrl(data.video_url)) {
        errors.video_url = t.invalid_youtube_url;
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [data, t, role, teamSize, collaborators, interfaceLocale, categories, selectedFiles]);

  const isFormComplete = useCallback(() => {
    if (role !== 'principal') return true;
    const checks = {
      theme: !!data.theme && themes.some(t => t.id_theme == data.theme),
      categorie: !!data.categorie && categories.some(c => c.id_categorie == data.categorie),
      titre_oeuvre_fr: !!data.titre_oeuvre_fr,
      titre_oeuvre_ar: !!data.titre_oeuvre_ar,
      descriptif_oeuvre_fr: !!data.descriptif_oeuvre_fr,
      descriptif_oeuvre_ar: !!data.descriptif_oeuvre_ar,
      date_publication: !!data.date_publication,
      collaborators: teamSize > 1 ? collaborators.length === teamSize - 1 : true,
      file: selectedFiles.length > 0 || !!data.video_url,
    };
    return Object.values(checks).every(Boolean);
  }, [data, themes, categories, role, teamSize, collaborators, selectedFiles]);

  const handleTeamSizeChange = useCallback((e) => {
    const value = parseInt(e.target.value);
    setTeamSize(value);
    if (value === 1) {
      setCollaborators([]);
      setTempCollaborators([]);
      setRole('principal');
      onChange({ target: { name: 'role', value: 'principal' } });
      onChange({ target: { name: 'collaborators', value: [] } });
    }
    onChange({ target: { name: 'teamSize', value } });
  }, [onChange]);

  const handleRoleChange = useCallback((e) => {
    const value = e.target.value;
    setRole(value);
    if (value !== 'principal') {
      setCollaborators([]);
      setTempCollaborators([]);
      setFormErrors({});
      setSelectedFiles([]);
      onChange({ target: { name: 'collaborators', value: [] } });
      onChange({ target: { name: 'fichiers', value: [] } });
      onChange({ target: { name: 'titre_oeuvre_fr', value: '' } });
      onChange({ target: { name: 'titre_oeuvre_ar', value: '' } });
      onChange({ target: { name: 'descriptif_oeuvre_fr', value: '' } });
      onChange({ target: { name: 'descriptif_oeuvre_ar', value: '' } });
      onChange({ target: { name: 'date_publication', value: '' } });
      onChange({ target: { name: 'video_url', value: '' } });
    }
    onChange({ target: { name: 'role', value } });
  }, [onChange]);

  const handleTempCollaboratorChange = (id) => {
    if (tempCollaborators.includes(id)) {
      setTempCollaborators(tempCollaborators.filter(c => c !== id));
      setModalError('');
    } else if (tempCollaborators.length < teamSize - 1) {
      setTempCollaborators([...tempCollaborators, id]);
      setModalError('');
    } else {
      setFormErrors(prev => ({
        ...prev,
        collaborators: t.required.replace(':attribute', t.collaborators) + ` (${interfaceLocale === 'fr' ? 'Maximum' : 'الحد الأقصى'} ${teamSize - 1} ${interfaceLocale === 'fr' ? 'collaborateurs' : 'متعاونين'})`,
      }));
    }
  };

  const handleValidateCollaborators = () => {
    if (tempCollaborators.length !== teamSize - 1) {
      setModalError(t.required.replace(':attribute', t.collaborators) + ` (${interfaceLocale === 'fr' ? 'Sélectionnez exactement' : 'اختر بالضبط'} ${teamSize - 1} ${interfaceLocale === 'fr' ? 'collaborateurs' : 'متعاونين'})`);
      return;
    }
    setCollaborators(tempCollaborators);
    onChange({ target: { name: 'collaborators', value: tempCollaborators } });
    setFormErrors(prev => ({ ...prev, collaborators: '' }));
    setModalError('');
    setIsModalOpen(false);
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const isIllustration = categories.some(cat =>
      cat.id_categorie == data.categorie &&
      (cat.nom_categorie_fr.toLowerCase() === 'illustration' || cat.nom_categorie_ar.toLowerCase() === 'الرسومات التوضيحية')
    );
    const totalFiles = files.length;
    const maxFiles = isIllustration ? 10 : 1;
    const maxSize = 100 * 1024 * 1024; // 100 Mo en octets

    if (totalFiles > maxFiles) {
      setFormErrors(prev => ({
        ...prev,
        file: `${t.required.replace(':attribute', t.file)} (${interfaceLocale === 'fr' ? 'Maximum' : 'الحد الأقصى'} ${maxFiles} ${interfaceLocale === 'fr' ? maxFiles > 1 ? 'fichiers' : 'fichier' : maxFiles > 1 ? 'ملفات' : 'ملف'})`,
      }));
      return;
    }

    for (const file of files) {
      if (file.size > maxSize) {
        setFormErrors(prev => ({
          ...prev,
          file: t.max_video_size,
        }));
        return;
      }
      if (file.type.startsWith('video/')) {
        const isValidDuration = await checkVideoDuration(file);
        if (!isValidDuration) {
          setFormErrors(prev => ({
            ...prev,
            file: t.max_video_duration,
          }));
          return;
        }
      }
    }

    setSelectedFiles(files);
    if (typeof onFileChange === 'function') {
      onFileChange(e);
    } else {
      console.error('onFileChange is not a function. Please ensure it is passed correctly from the parent component.');
    }
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateFormErrors()) {
      console.error('Formulaire incomplet, vérifiez les champs.');
      return;
    }
    const form = new FormData();
    form.append('theme', data.theme || '');
    form.append('categorie', data.categorie || '');
    form.append('id_personne', userId || '');
    form.append('taille_equipe', teamSize);
    form.append('role', role);
    form.append('titre_oeuvre_fr', data.titre_oeuvre_fr || '');
    form.append('titre_oeuvre_ar', data.titre_oeuvre_ar || '');
    form.append('descriptif_oeuvre_fr', data.descriptif_oeuvre_fr || '');
    form.append('descriptif_oeuvre_ar', data.descriptif_oeuvre_ar || '');
    form.append('date_publication', data.date_publication || '');
    form.append('video_url', data.video_url || '');
    if (role === 'principal') {
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file, index) => {
          form.append(`files[${index}]`, file);
        });
      }
      if (collaborators.length > 0) {
        collaborators.forEach((id, index) => {
          form.append(`collaborateurs[${index}]`, id);
        });
      }
    }
    try {
      await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
      const response = await fetch('http://localhost:8000/soumission/step3', {
        method: 'POST',
        body: form,
        credentials: 'include',
        headers: {
          'X-XSRF-TOKEN': decodeURIComponent(token),
          Accept: 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessages = errorData.errors
          ? Object.entries(errorData.errors)
            .map(([field, messages]) => {
              return messages.map((msg) => {
                // Mapper les messages d'erreur aux traductions
                if (msg.includes('required')) {
                  return t.required?.replace(':attribute', t[field] || field) || `Le champ ${field} est requis.`;
                }
                if (msg.includes('regex')) {
                  return t.invalid_youtube_url || 'L\'URL doit être une URL YouTube valide.';
                }
                return t[msg] || msg;
              }).join(' ');
            })
            .join(' ')
          : errorData.error || `Erreur HTTP ${response.status}`;
        setError(errorMessages);
        return;
      }
      const result = await response.json();
      alert(result.message || (interfaceLocale === 'fr' ? 'Soumission réussie' : 'تم الإرسال بنجاح'));
    } catch (err) {
      console.error('Erreur lors de la soumission :', err);
      setError(t.network_error || (interfaceLocale === 'fr' ? 'Une erreur réseau s\'est produite.' : 'حدث خطأ في الشبكة.'));
    }
  }, [data, userId, teamSize, role, collaborators, t, interfaceLocale, selectedFiles, validateFormErrors]);

  //réinitialiser l'état du modal et annuler les sélections temporaires de collaborateurs ou les erreurs.
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTempCollaborators(collaborators); // Revenir aux collaborateurs enregistrés
    setModalError('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-6 w-full max-w-5xl bg-white shadow-md rounded-lg p-8 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
      dir={direction}
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
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
          <label className="block mb-2 text-sm font-medium text-gray-900">{t.role}</label>
          <select
            name="role"
            value={role}
            onChange={handleRoleChange}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
            required
          >
            <option value="">{interfaceLocale === 'fr' ? '-- Choisir --' : '-- اختر --'}</option>
            <option value="principal">{interfaceLocale === 'fr' ? 'Principal' : 'رئيسي'}</option>
            <option value="collaborateur">{interfaceLocale === 'fr' ? 'Collaborateur' : 'متعاون'}</option>
          </select>
          {formErrors.role && <p className="text-red-500 text-sm">{formErrors.role}</p>}
        </div>
        {role === 'principal' && (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">{t.teamSize}</label>
            <select
              value={teamSize}
              onChange={handleTeamSizeChange}
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
              required
            >
              {[1, 2, 3, 4].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      {role === 'principal' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">{t.theme}</label>
              <select
                name="theme"
                value={data.theme || ''}
                onChange={onChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
                required
              >
                <option value="">{interfaceLocale === 'fr' ? '-- Choisir --' : '-- اختر --'}</option>
                {themes.map(theme => (
                  <option key={theme.id_theme} value={theme.id_theme}>
                    {interfaceLocale === 'ar' ? theme.titre_ar : theme.titre_fr}
                  </option>
                ))}
              </select>
              {formErrors.theme && <p className="text-red-500 text-sm">{formErrors.theme}</p>}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">{t.categorie}</label>
              <select
                name="categorie"
                value={data.categorie || ''}
                onChange={onChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
                required
              >
                <option value="">{interfaceLocale === 'fr' ? '-- Choisir --' : '-- اختر --'}</option>
                {categories.map(cat => (
                  <option key={cat.id_categorie} value={cat.id_categorie}>
                    {interfaceLocale === 'ar' ? cat.nom_categorie_ar : cat.nom_categorie_fr}
                  </option>
                ))}
              </select>
              {formErrors.categorie && <p className="text-red-500 text-sm">{formErrors.categorie}</p>}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">{t.titre_oeuvre_fr}</label>
              <input
                type="text"
                name="titre_oeuvre_fr"
                value={data.titre_oeuvre_fr || ''}
                onChange={onChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
                required
              />
              {formErrors.titre_oeuvre_fr && <p className="text-red-500 text-sm">{formErrors.titre_oeuvre_fr}</p>}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">{t.titre_oeuvre_ar}</label>
              <input
                type="text"
                name="titre_oeuvre_ar"
                value={data.titre_oeuvre_ar || ''}
                onChange={onChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
                required
              />
              {formErrors.titre_oeuvre_ar && <p className="text-red-500 text-sm">{formErrors.titre_oeuvre_ar}</p>}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">{t.descriptif_oeuvre_fr}</label>
              <textarea
                name="descriptif_oeuvre_fr"
                value={data.descriptif_oeuvre_fr || ''}
                onChange={onChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
                rows="4"
                required
              />
              {formErrors.descriptif_oeuvre_fr && <p className="text-red-500 text-sm">{formErrors.descriptif_oeuvre_fr}</p>}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">{t.descriptif_oeuvre_ar}</label>
              <textarea
                name="descriptif_oeuvre_ar"
                value={data.descriptif_oeuvre_ar || ''}
                onChange={onChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
                rows="4"
                required
              />
              {formErrors.descriptif_oeuvre_ar && <p className="text-red-500 text-sm">{formErrors.descriptif_oeuvre_ar}</p>}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">{t.date_publication}</label>
              <input
                type="date"
                name="date_publication"
                value={data.date_publication || ''}
                onChange={onChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
                required
              />
              {formErrors.date_publication && <p className="text-red-500 text-sm">{formErrors.date_publication}</p>}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">{t.video_url}</label>
              <input
                type="url"
                name="video_url"
                value={data.video_url || ''}
                onChange={onChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}
                placeholder={interfaceLocale === 'fr' ? 'https://www.youtube.com/watch?v=...' : 'https://www.youtube.com/watch?v=...'}
              />
              {formErrors.video_url && <p className="text-red-500 text-sm">{formErrors.video_url}</p>}
            </div>
          </div>
          {teamSize > 1 && (
            console.log('Eligible Users:', eligibleUsers.length),
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">{t.collaborators}</label>
              {eligibleUsers.length < teamSize - 1 ? (
                <p className="text-sm text-gray-600">
                  {interfaceLocale === 'fr' ? 'Aucun collaborateur disponible' : 'لا يوجد متعاونون متاحون'}
                </p>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setTempCollaborators(collaborators);
                      setIsModalOpen(true);
                    }}
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : 'text-left'}`}
                    disabled={eligibleUsers.length === 0}
                  >
                    {interfaceLocale === 'fr' ? 'Sélectionner les collaborateurs' : 'اختر المتعاونين'}
                  </button>
                  {collaborators.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-900">
                        {interfaceLocale === 'fr' ? 'Collaborateurs sélectionnés :' : 'المتعاونون المختارون :'}
                      </p>
                      <ul className="list-disc pl-5 text-sm text-gray-600">
                        {collaborators.map(id => {
                          const user = eligibleUsers.find(u => u.id_personne === id);
                          return user ? (
                            <li key={id}>
                              {interfaceLocale === 'ar'
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
              {formErrors.collaborators && <p className="text-red-500 text-sm">{formErrors.collaborators}</p>}
            </div>
          )}
          {isModalOpen && (
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  handleCloseModal(); // Utiliser la fonction définie
                }
              }}
            >
              <div className={`bg-white rounded-lg shadow-md w-full max-w-lg p-6 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {interfaceLocale === 'fr' ? 'Sélectionner les collaborateurs' : 'اختر المتعاونين'}
                </h3>
                <div className="mb-4">
                  {interfaceLocale === 'fr' ? (
                    <div className="flex items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus-within:ring-blue-500 focus-within:border-blue-500 w-full p-1">
                      <span className="mr-2 text-xs">{t.search || 'Rechercher :'}</span>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t.search_placeholder || 'Rechercher...'}
                        className="flex-grow bg-transparent border-none focus:outline-none text-sm"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus-within:ring-blue-500 focus-within:border-blue-500 w-full p-1">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t.search_placeholder || 'بحث...'}
                        className="flex-grow bg-transparent border-none focus:outline-none text-sm"
                      />
                      <span className="ml-2 text-xs">{t.search || ':بحث'}</span>
                    </div>
                  )}
                </div>
                <ul className={`w-full py-2 overflow-y-auto text-gray-700 dark:text-gray-200 max-h-[calc(100vh-200px)] ${interfaceLocale === 'ar' ? 'mr-2' : 'ml-2'}`}>
                  {eligibleUsers
                    .filter(user =>
                      (interfaceLocale === 'fr'
                        ? `${user.nom_personne_fr} ${user.prenom_personne_fr}`
                        : `${user.nom_personne_ar} ${user.prenom_personne_ar}`
                      ).toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(user => {
                      const photo = user.dossier?.fichiers?.find(f => f.type === 'photo');
                      const filePath = photo ? photo.file_path.replace(/^photos\//, '') : '';
                      const photoSrc = photo ? `http://localhost:8000/storage/photos/${filePath}` : '/docs/images/people/default-profile.jpg';
                      return (
                        <li key={user.id_personne} className="mb-2">
                          <label className={`flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${tempCollaborators.includes(user.id_personne) ? 'bg-blue-100 dark:bg-blue-600 text-blue-800 dark:text-blue-200' : ''} ${interfaceLocale === 'ar' ? 'justify-end' : ''}`}>
                            <input
                              type="checkbox"
                              checked={tempCollaborators.includes(user.id_personne)}
                              onChange={() => handleTempCollaboratorChange(user.id_personne)}
                              className="mr-2"
                              disabled={!tempCollaborators.includes(user.id_personne) && tempCollaborators.length >= teamSize - 1}
                            />
                            <img
                              className={`w-12 h-12 ${interfaceLocale === 'ar' ? 'ms-2' : 'me-2'} rounded-full object-cover`}
                              src={photoSrc}
                              alt={`${interfaceLocale === 'ar' ? `${user.nom_personne_ar} ${user.prenom_personne_ar}` : `${user.nom_personne_fr} ${user.prenom_personne_fr}`}`}
                            />
                            <span className={interfaceLocale === 'ar' ? 'text-right' : ''}>
                              {interfaceLocale === 'ar' ? `${user.nom_personne_ar} ${user.prenom_personne_ar}` : `${user.nom_personne_fr} ${user.prenom_personne_fr}`}
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
                    onClick={handleCloseModal} // Utiliser la fonction définie
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    {interfaceLocale === 'fr' ? 'Annuler' : 'إلغاء'}
                  </button>
                  <button
                    type="button"
                    onClick={handleValidateCollaborators}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    {interfaceLocale === 'fr' ? 'Valider' : 'تأكيد'}
                  </button>
                </div>
              </div>
            </div>
          )}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">{t.video_file}</label>
            <label className={`relative inline-block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus-within:ring-blue-500 focus:with-border-blue-500 w-full p-2.5 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}>
              <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                {interfaceLocale === 'fr'
                  ? (categories.some(cat => cat.id_categorie == data.categorie &&
                    (cat.nom_categorie_fr.toLowerCase() === 'illustration' || cat.nom_categorie_ar.toLowerCase() === 'الرسومات التوضيحية'))
                    ? 'Sélectionner des fichiers/vidéos' : 'Sélectionner un fichier/vidéo')
                  : (categories.some(cat => cat.id_categorie == data.categorie &&
                    (cat.nom_categorie_fr.toLowerCase() === 'illustration' || cat.nom_categorie_ar.toLowerCase() === 'الرسومات التوضيحية'))
                    ? 'اختر ملفات/فيديوهات' : 'اختر ملفًا/فيديو')}
              </span>
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.png,.mp4,.mov,.avi"
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                multiple={data.categorie && categories.some(cat =>
                  cat.id_categorie == data.categorie &&
                  (cat.nom_categorie_fr.toLowerCase() === 'illustration' || cat.nom_categorie_ar.toLowerCase() === 'الرسومات التوضيحية')
                )}
                ref={fileInputRef}
              />
            </label>
            {selectedFiles.length > 0 && (
              <div className={`mt-2 ${interfaceLocale === 'ar' ? 'text-right' : ''}`}>
                <p className="text-sm font-medium text-gray-900">
                  {interfaceLocale === 'fr' ? 'Fichier(s)/Vidéo(s) sélectionné(s) :' : 'الملف(ات)/الفيديو(ات) المختار(ة) :'}
                </p>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {selectedFiles.map((file, index) => (
                    <li key={index}>
                      {file.name}{' '}
                      <button
                        type="button"
                        onClick={() => handlePreviewFile(file)}
                        className="text-blue-600 hover:underline"
                      >
                        {interfaceLocale === 'fr' ? '(Voir)' : '(عرض)'}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {formErrors.file && <p className="text-red-500 text-sm">{formErrors.file}</p>}
          </div>
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
          {interfaceLocale === 'fr' ? 'Soumettre' : 'إرسال'}
        </button>
      </div>
    </form>
  );
}