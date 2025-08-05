import React, { useState, useEffect } from 'react';
import type { Apartment } from '../types';
import { apartmentApi } from '../utils/api';

interface ApartmentsListProps {
  onEdit: (apartment: Apartment) => void;
  onRefresh?: () => void;
  refreshTrigger?: number;
}

// Skeleton компонент для загрузки
const ApartmentSkeleton: React.FC = () => (
  <div className="card-enhanced p-6 animate-fade-in">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center space-x-4 mb-3">
          <div className="skeleton-title w-48"></div>
          <div className="skeleton-button w-16"></div>
        </div>
        <div className="space-y-2">
          <div className="skeleton-text w-64"></div>
          <div className="skeleton-text w-96"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-text w-24"></div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex space-x-2 ml-6">
        <div className="skeleton-button"></div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  </div>
);

const ApartmentsList: React.FC<ApartmentsListProps> = ({ 
  onEdit, 
  onRefresh,
  refreshTrigger = 0 
}) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apartmentApi.getAll();
      setApartments(data);
    } catch (err) {
      setError('Ошибка загрузки апартаментов');
      console.error('Error loading apartments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApartments();
  }, [refreshTrigger]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Вы уверены, что хотите удалить апартамент "${title}"?`)) {
      return;
    }

    try {
      await apartmentApi.delete(id);
      setApartments(prev => prev.filter(apt => apt.id !== id));
      onRefresh?.();
    } catch (err) {
      alert('Ошибка при удалении апартамента');
      console.error('Error deleting apartment:', err);
    }
  };

  const getFullAddress = (apartment: Apartment) => {
    return `${apartment.base_address}, корп. ${apartment.building_number}, кв. ${apartment.apartment_number}`;
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-heading font-semibold text-gray-900">
            Апартаменты
          </h2>
          <div className="flex items-center space-x-4">
            <div className="skeleton-button"></div>
            <div className="skeleton-button"></div>
          </div>
        </div>
        
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-scale-in">
          <div className="glass-effect rounded-xl p-6">
            <div className="skeleton-title w-24 mb-2"></div>
            <div className="skeleton-text w-16"></div>
          </div>
          <div className="glass-effect rounded-xl p-6">
            <div className="skeleton-title w-32 mb-2"></div>
            <div className="skeleton-text w-20"></div>
          </div>
          <div className="glass-effect rounded-xl p-6">
            <div className="skeleton-title w-28 mb-2"></div>
            <div className="skeleton-text w-18"></div>
          </div>
        </div>

        {[...Array(3)].map((_, i) => (
          <ApartmentSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-enhanced p-6 animate-fade-in">
        <div className="text-center">
          <div className="notification-error mb-4">
            <p>{error}</p>
          </div>
          <button 
            onClick={loadApartments}
            className="btn-coral-gradient"
          >
            🔄 Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (apartments.length === 0) {
    return (
      <div className="card-enhanced p-8 animate-fade-in">
        <div className="text-center text-gray-500">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Апартаменты не найдены</h3>
          <p className="text-gray-600 mb-6">Добавьте первый апартамент, чтобы начать работу.</p>
          <button className="btn-gradient">
            🏠 Добавить апартамент
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-scale-in">
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Всего апартаментов</p>
              <p className="text-2xl font-bold text-gray-900">{apartments.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Активные</p>
              <p className="text-2xl font-bold text-gray-900">{apartments.filter(a => a.title).length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">С менеджерами</p>
              <p className="text-2xl font-bold text-gray-900">{apartments.filter(a => a.manager_name).length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Список апартаментов */}
      <div className="space-y-4">
        {apartments.map((apartment, index) => (
          <div 
            key={apartment.id} 
            className="card-enhanced p-6 animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {apartment.title}
                  </h3>
                  <span className="px-3 py-1 bg-morent-navy text-white text-sm rounded-full font-medium">
                    #{apartment.apartment_number}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Активен
                  </span>
                </div>
                
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">Адрес:</span> {getFullAddress(apartment)}
                  </div>
                  
                  {apartment.description && (
                    <div className="flex items-start space-x-2">
                      <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span><span className="font-medium">Описание:</span> {apartment.description}</span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                      <span className="font-medium">Wi-Fi:</span> {apartment.wifi_name || 'Не указан'}
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span className="font-medium">Код подъезда:</span> {apartment.code_building || 'Не указан'}
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v-1H7v-1H5v-1H3l.757-.757A6 6 0 0115 7z" />
                      </svg>
                      <span className="font-medium">Код замка:</span> {apartment.code_lock || 'Не указан'}
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium">Менеджер:</span> {apartment.manager_name || 'Не указан'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 ml-6">
                <button
                  onClick={() => onEdit(apartment)}
                  className="btn-gradient px-4 py-2 text-sm font-medium"
                  title="Редактировать"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                <button
                  onClick={() => handleDelete(apartment.id, apartment.title)}
                  className="btn-coral-gradient px-4 py-2 text-sm font-medium"
                  title="Удалить"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApartmentsList;
