import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminPage from './pages/Admin';
import BookingPage from './pages/Booking';
import TestPage from './pages/TestPage';
import TestBookingPage from './pages/TestBooking';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './utils/theme.tsx';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
          <Routes>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/booking/:slug" element={<BookingPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/test-booking" element={<TestBookingPage />} />
            <Route path="/" element={<Navigate to="/admin" replace />} />
          </Routes>
          
          <ThemeToggle />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
