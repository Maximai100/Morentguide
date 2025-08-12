import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import TestApp from './TestApp.tsx'

// Добавляем проверку для отладки
console.log('main.tsx loaded');

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (!rootElement) {
  console.error('Root element not found!');
} else {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    console.log('React app rendered successfully');
  } catch (error) {
    console.error('Error rendering app:', error);
  }
}

// Импорт API тестера в development режиме
if (import.meta.env.DEV) {
  import('./utils/api-test').then(({ testDirectusAPI }) => {
    (window as any).testDirectusAPI = testDirectusAPI;
    console.log('🔧 Development mode: используйте testDirectusAPI() в консоли для тестирования API');
  }).catch(err => {
    console.error('Error loading api-test:', err);
  });
