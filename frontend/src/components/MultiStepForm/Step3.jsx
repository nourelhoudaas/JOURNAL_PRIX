
import React, { useState, useEffect } from 'react';

export default function Step3({ data, onChange, onBack, userId, themes, categories }) {
  const [teamSize, setTeamSize] = useState(1);
  const [role, setRole] = useState('principal');
  const [collaborators, setCollaborators] = useState([]);
  const [eligibleUsers, setEligibleUsers] = useState([]);

  useEffect(() => {
    // Charger les utilisateurs éligibles si nécessaire
    if (teamSize > 1 && role === 'principal') {
      fetch('/soumission/eligible-collaborators')
        .then((res) => res.json())
        .then((data) => setEligibleUsers(data))
        .catch((err) => console.error('Erreur de chargement des collaborateurs :', err));
    }
  }, [teamSize, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('theme', data.theme);
    form.append('categorie', data.categorie);
    form.append('id_personne', userId);
    form.append('taille_equipe', teamSize);
    form.append('role', role);
    if (role === 'principal') {
      form.append('file', data.file);
      collaborators.forEach((c, i) => form.append(`collaborateurs[${i}]`, c));
    }

    const response = await fetch('/soumission/step3', {
      method: 'POST',
      body: form
    });

    const result = await response.json();
    alert(result.message || 'Soumission réussie');
  };

  return (
    <form onSubmit={handleSubmit}
      className="space-y-6 w-full max-w-5xl bg-white shadow-md rounded-lg p-8">

    <div className="mb-6 w-full">
      <label className="block mb-2 text-sm font-medium text-gray-900">Nombre de membres de l’équipe</label>
      <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        value={teamSize}
        onChange={(e) => setTeamSize(parseInt(e.target.value))}>
        {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
      </select>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {teamSize > 1 && (
        <>
          <label className="block mb-2 text-sm font-medium text-gray-900">Votre rôle</label>
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="principal">Principal</option>
            <option value="collaborateur">Collaborateur</option>
          </select>
        </>
      )}

      <label className="block mb-2 text-sm font-medium text-gray-900">Thème</label>
      <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" name="theme" value={data.theme || ''} onChange={onChange} required>
        <option value="">-- Choisir --</option>
        {themes.map(theme => (
          <option key={theme.id_theme} value={theme.id_theme}>{theme.titre_fr}</option>
        ))}
      </select>

      <label className="block mb-2 text-sm font-medium text-gray-900">Catégorie</label>
      <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" name="categorie" value={data.categorie || ''} onChange={onChange} required>
        <option value="">-- Choisir --</option>
        {categories.map(cat => (
          <option key={cat.id_categorie} value={cat.id_categorie}>{cat.nom_categorie_fr}</option>
        ))}
      </select>
</div>
      {role === 'principal' && (
        <>
          {teamSize > 1 && (
            <>
              <label className="block mb-2 text-sm font-medium text-gray-900">Collaborateurs</label>
              {eligibleUsers.length === 0 ? (
                <p>Aucun collaborateur disponible</p>
              ) : (
                eligibleUsers.map(user => (
                  <div key={user.id_personne}>
                    <input
                      type="checkbox"
                      value={user.id_personne}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (e.target.checked) {
                          setCollaborators([...collaborators, val]);
                        } else {
                          setCollaborators(collaborators.filter(c => c !== val));
                        }
                      }}
                    />
                    {user.nom} {user.prenom}
                  </div>
                ))
              )}
            </>
          )}

          <label className="block mb-2 text-sm font-medium text-gray-900">Fichier œuvre</label>
          <input type="file" name="file" onChange={onChange} accept=".pdf,.jpg,.png" required />
        </>
      )}
      
      <button type="button" onClick={onBack}>Retour</button>
      <button type="submit">Soumettre</button>
    </form>
  );
}
