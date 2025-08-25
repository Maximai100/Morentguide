import React, { useState } from 'react';
import type { Apartment } from '../types';

interface NavigationProps {
  apartment: Apartment;
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ apartment, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const openInGoogleMaps = () => {
    const address = `${apartment.base_address}, ${apartment.building_number}`;
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const openInYandexMaps = () => {
    const address = `${apartment.base_address}, ${apartment.building_number}`;
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://yandex.ru/maps/?text=${encodedAddress}`, '_blank');
  };

  const openInAppleMaps = () => {
    const address = `${apartment.base_address}, ${apartment.building_number}`;
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.apple.com/?q=${encodedAddress}`, '_blank');
  };

  const copyAddress = async () => {
    const address = `${apartment.base_address}, корпус ${apartment.building_number}, апартамент ${apartment.apartment_number}`;
    try {
      await navigator.clipboard.writeText(address);
      // Показываем уведомление об успешном копировании
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg z-50';
      notification.textContent = 'Адрес скопирован!';
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 2000);
    } catch (error) {
      console.error('Ошибка копирования адреса:', error);
    }
  };

  const getDirections = () => {
    // Определяем устройство и открываем соответствующее приложение
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
      openInAppleMaps();
    } else if (/android/.test(userAgent)) {
      openInGoogleMaps();
    } else {
      // Для десктопа показываем выбор
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="text-lg font-heading font-semibold mb-4 text-gray-900 dark:text-white">
        🗺️ Навигация
      </h3>
      
      <div className="space-y-4">
        {/* Адрес */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Адрес апартаментов:
          </h4>
          <p className="text-gray-700 dark:text-gray-300">
            {apartment.base_address}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Корпус {apartment.building_number}, апартамент {apartment.apartment_number}
          </p>
        </div>

        {/* Кнопки навигации */}
        <div className="space-y-3">
          <button
            onClick={getDirections}
            className="w-full bg-[#0e2a3b] text-white py-3 px-4 rounded-lg hover:bg-[#0a1f2b] transition-colors flex items-center justify-center space-x-2"
          >
            <span>🚗</span>
            <span>Построить маршрут</span>
          </button>

          <button
            onClick={copyAddress}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
          >
            <span>📋</span>
            <span>Скопировать адрес</span>
          </button>
        </div>

        {/* Выбор карт (для десктопа) */}
        {isExpanded && (
          <div className="space-y-2 animate-fade-in">
            <button
              onClick={openInGoogleMaps}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
            >
              <span>🗺️</span>
              <span>Google Maps</span>
            </button>
            
            <button
              onClick={openInYandexMaps}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
            >
              <span>🗺️</span>
              <span>Яндекс.Карты</span>
            </button>
          </div>
        )}

        {/* Полезная информация */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            💡 Полезные советы:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Сохраните адрес в закладках</li>
            <li>• Сделайте скриншот с инструкциями</li>
            <li>• Добавьте контакты менеджера в телефон</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
