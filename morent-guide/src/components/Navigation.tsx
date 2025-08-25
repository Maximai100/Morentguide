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
      notification.className = 'notification notification-success animate-fade-in';
      notification.textContent = 'Адрес скопирован в буфер обмена';
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);
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
    <div className={`card ${className}`}>
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
          </svg>
          Навигация
        </h3>
      </div>
      
      <div className="card-body space-y-6">
        {/* Адрес */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Адрес апартаментов
          </h4>
          <div className="space-y-1">
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              {apartment.base_address}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Корпус {apartment.building_number}, апартамент {apartment.apartment_number}
            </p>
          </div>
        </div>

        {/* Кнопки навигации */}
        <div className="space-y-3">
          <button
            onClick={getDirections}
            className="btn btn-primary w-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span>Построить маршрут</span>
          </button>

          <button
            onClick={copyAddress}
            className="btn btn-secondary w-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Скопировать адрес</span>
          </button>
        </div>

        {/* Выбор карт (для десктопа) */}
        {isExpanded && (
          <div className="space-y-2 animate-fade-in">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Выберите карты:
            </div>
            <button
              onClick={openInGoogleMaps}
              className="btn btn-ghost w-full justify-start"
            >
              <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>Google Maps</span>
            </button>
            
            <button
              onClick={openInYandexMaps}
              className="btn btn-ghost w-full justify-start"
            >
              <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>Яндекс.Карты</span>
            </button>
          </div>
        )}

        {/* Полезная информация */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Полезные советы
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Сохраните адрес в закладках браузера</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Сделайте скриншот с инструкциями</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Добавьте контакты менеджера в телефон</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
