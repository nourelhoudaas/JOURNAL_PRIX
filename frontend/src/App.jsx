import React from 'react';
import MultiStepForm from './components/MultiStepForm/MultiStepForm';

function App() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* <h1 className="text-2xl font-bold mb-6">Participation au concours</h1> */}
      <nav className="w-full bg-white shadow px-8 py-4 flex items-center justify-between fixed top-0 z-50">
        <div className="flex items-center space-x-4">
          <img src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" className="h-6 w-auto" alt="Logo" />
          <a href="#" className="text-sm font-semibold text-gray-700 hover:text-indigo-600">Product</a>
          <a href="#" className="text-sm font-semibold text-gray-700 hover:text-indigo-600">Features</a>
          <a href="#" className="text-sm font-semibold text-gray-700 hover:text-indigo-600">Marketplace</a>
          <a href="#" className="text-sm font-semibold text-gray-700 hover:text-indigo-600">Company</a>
        </div>
        <a href="/login" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 flex items-center space-x-1">
          <span>Log in</span>
          <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </nav>
      <MultiStepForm />
    </div>
  );
}

export default App;
