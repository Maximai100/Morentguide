import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Импорт API тестера в development режиме
if (import.meta.env.DEV) {
  import('./utils/api-test').then(({ runApiTest }) => {
    (window as any).testDirectusAPI = runApiTest;
    console.log('🔧 Development mode: используйте testDirectusAPI() в консоли для тестирования API');
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
