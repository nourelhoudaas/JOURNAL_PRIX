import React, { useState } from 'react';
import MultiStepForm from './components/MultiStepForm/MultiStepForm';
import Logo from './assets/img/logo_ministere.png';

function App() {
  const [locale, setLocale] = useState('fr'); // 'fr' par défaut

  const handleLocaleChange = (newLocale) => {
    setLocale(newLocale);
  };

  // Définir les traductions
  const translations = {
    fr: { logout: 'Déconnexion' },
    ar: { logout: 'تسجيل الخروج' },
  };

   // Définir la direction en fonction de la langue
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="w-full mx-auto py-11 max-w-7xl pt-16">
      <nav className="w-full bg-white shadow px-8 py-4 flex items-center justify-between fixed top-0 z-50">
        <div className="flex items-center space-x-4">
          <img src={Logo} className="h-6 w-auto" alt="Logo du ministère" />
        </div>
        <div className="flex items-center space-x-4">
          <label htmlFor="language-select" className="sr-only">
            Sélectionner la langue
          </label>
          <select
            id="language-select"
            value={locale}
            onChange={(e) => handleLocaleChange(e.target.value)}
            className="p-2 border rounded bg-white text-gray-900 text-sm"
          >
            <option value="fr">Français</option>
            <option value="ar">عربي</option>
          </select>
          <a
            href="/logout"
            className="text-sm font-semibold text-gray-700 hover:text-indigo-600 flex items-center space-x-1"
          >
            <span>{translations[locale].logout}</span>
            <svg
              className="h-4 w-4 ml-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </nav>
      <MultiStepForm locale={locale} setLocale={handleLocaleChange} direction={direction} />
    </div>
  );
}

export default App;