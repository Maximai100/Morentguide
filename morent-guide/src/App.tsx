import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from 'react-router-dom';
import AdminPage from './pages/Admin';
import BookingPage from './pages/Booking';
import TestBookingPage from './pages/TestBooking';
import NotFoundPage from './pages/NotFound';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';
import { useNotifications } from './hooks/useNotifications';
import { useServiceWorker } from './hooks/useServiceWorker';

// Root layout component
const RootLayout = () => {
  return (
    <div className="app">
      <Outlet /> {/* Child routes will render here */}
      <ThemeToggle />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/admin" replace /> },
      { path: 'admin', element: <AdminPage /> },
      { path: 'booking/:slug', element: <BookingPage /> },
      { path: 'test', element: <TestBookingPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
], { basename: import.meta.env.BASE_URL });

function App() {
  // Custom hooks for initialization
  useTheme();
  useNotifications();
  useServiceWorker();

  return <RouterProvider router={router} />;
}

export default App;
