import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminPage from './pages/Admin';
import BookingPage from './pages/Booking';

function App() {
  return (
    <Router>
      <Routes>
        {/* Главная страница перенаправляет на админку */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        {/* Админ-панель менеджера */}
        <Route path="/admin" element={<AdminPage />} />
        
        {/* Страница бронирования для гостей */}
        <Route path="/booking/:slug" element={<BookingPage />} />
        
        {/* 404 - страница не найдена */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-heading font-bold text-morent-navy mb-4">404</h1>
              <p className="text-gray-600 mb-6">Страница не найдена</p>
              <a 
                href="/admin" 
                className="btn-primary inline-block"
              >
                Перейти в админ-панель
              </a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;