import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminPage from './pages/Admin';
import BookingPage from './pages/Booking';

function App() {
  // Проверка работоспособности
  console.log('App component loaded');
  
  // Базовый путь зависит от режима
  const basename = import.meta.env.MODE === 'production' ? '/morent-guide' : '';
  
  return (
    <Router basename={basename}>
      <Routes>
        {/* Главная страница перенаправляет на админку */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        {/* Админ-панель менеджера */}
        <Route path="/admin" element={<AdminPage />} />
        
        {/* Страница бронирования для гостей */}
        <Route path="/booking/:slug" element={<BookingPage />} />
        
        {/* 404 - страница не найдена */}
        <Route path="*" element={
          <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>404</h1>
              <p style={{ color: '#666', marginBottom: '1.5rem' }}>Страница не найдена</p>
              <a 
                href="/admin" 
                style={{ 
                  backgroundColor: '#333', 
                  color: 'white', 
                  padding: '10px 20px', 
                  textDecoration: 'none',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}
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