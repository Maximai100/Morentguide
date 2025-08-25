import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import AdminPage from './pages/Admin';
import BookingPage from './pages/Booking';
import TestBookingPage from './pages/TestBooking';
import ThemeToggle from './components/ThemeToggle';
import { initializeTheme } from './utils/theme';
import { initializeNotifications } from './utils/notifications';

function App() {
  // Инициализация темы и уведомлений при загрузке приложения
  useEffect(() => {
    // Инициализируем тему
    initializeTheme();
    
    // Инициализируем уведомления
    initializeNotifications();
    
    // Регистрируем Service Worker для PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker зарегистрирован:', registration);
        })
        .catch(error => {
          console.error('Ошибка регистрации Service Worker:', error);
        });
    }
  }, []);

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="app">
        <Routes>
          {/* Главная страница перенаправляет на админку */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          
          {/* Админ-панель менеджера */}
          <Route path="/admin" element={<AdminPage />} />
          
          {/* Страница бронирования для гостей */}
          <Route path="/booking/:slug" element={<BookingPage />} />
          
          {/* Тестовая страница для проверки ссылок */}
          <Route path="/test" element={<TestBookingPage />} />
          
          {/* 404 - страница не найдена */}
          <Route path="*" element={
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
          } />
        </Routes>
        
        {/* Переключатель темы */}
        <ThemeToggle />
      </div>
    </Router>
  );
}

export default App;