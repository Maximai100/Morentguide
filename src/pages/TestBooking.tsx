import React from 'react';
import { Link } from 'react-router-dom';

const TestBookingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card-enhanced p-8">
          <h1 className="text-3xl font-bold mb-6">Тестирование гостевых ссылок</h1>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Демо-ссылка 1:</h3>
              <Link 
                to="/booking/demo-booking-1" 
                className="text-blue-600 hover:underline"
              >
                /booking/demo-booking-1
              </Link>
              <p className="text-sm text-gray-600 mt-1">
                Гость: Иван Иванов, Апартаменты Морент
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Демо-ссылка 2:</h3>
              <Link 
                to="/booking/demo-booking-2" 
                className="text-blue-600 hover:underline"
              >
                /booking/demo-booking-2
              </Link>
              <p className="text-sm text-gray-600 mt-1">
                Гость: Мария Петрова, Апартаменты Морент Премиум
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold mb-2">Инструкции:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Кликните на ссылки выше для тестирования</li>
              <li>Проверьте, что фотографии загружаются</li>
              <li>Убедитесь, что галерея работает с горизонтальным скроллом</li>
              <li>Проверьте увеличение фотографий при клике</li>
            </ul>
          </div>
          
          <div className="mt-6">
            <Link 
              to="/admin" 
              className="btn-primary"
            >
              Вернуться в админ-панель
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestBookingPage;