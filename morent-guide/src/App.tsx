import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminPage from './pages/Admin';
import BookingPage from './pages/Booking';
import TestBookingPage from './pages/TestBooking';
import NotFoundPage from './pages/NotFound'; // Импортируем новую страницу
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';
import { useNotifications } from './hooks/useNotifications';
import { useServiceWorker } from './hooks/useServiceWorker';

function App() {
  // Кастомные хуки для инициализации
  useTheme();
  useNotifications();
  useServiceWorker();

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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        
        {/* Переключатель темы */}
        <ThemeToggle />
      </div>
    </Router>
  );
}

export default App;
