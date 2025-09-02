import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">Страница не найдена</p>
        <a 
          href="/admin" 
          className="inline-block bg-[#0e2a3b] text-white px-6 py-3 rounded-lg hover:bg-[#0a1f2b] transition-colors"
        >
          Перейти в админ-панель
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
