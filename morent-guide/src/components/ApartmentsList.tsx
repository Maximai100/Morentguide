import React, { useState, useEffect } from 'react';
import type { Apartment } from '../types';
import { apartmentApi } from '../utils/api';

interface ApartmentsListProps {
  onEdit: (apartment: Apartment) => void;
  onRefresh?: () => void;
  refreshTrigger?: number;
}

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
      <div className="card p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-morent-navy mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка апартаментов...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={loadApartments}
            className="btn-primary mt-4"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (apartments.length === 0) {
    return (
      <div className="card p-8">
        <div className="text-center text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Апартаменты не найдены</h3>
          <p className="mt-2 text-gray-600">Добавьте первый апартамент, чтобы начать работу.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {apartments.map((apartment) => (
        <div key={apartment.id} className="card p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {apartment.title}
                </h3>
                <span className="px-3 py-1 bg-morent-navy text-white text-sm rounded-full">
                  {apartment.apartment_number}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Адрес:</span> {getFullAddress(apartment)}
                </p>
                <p>
                  <span className="font-medium">Описание:</span> {apartment.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <span className="font-medium">Wi-Fi:</span> {apartment.wifi_name}
                  </div>
                  <div>
                    <span className="font-medium">Код подъезда:</span> {apartment.code_building}
                  </div>
                  <div>
                    <span className="font-medium">Код замка:</span> {apartment.code_lock}
                  </div>
                  <div>
                    <span className="font-medium">Менеджер:</span> {apartment.manager_name}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 ml-6">
              <button
                onClick={() => onEdit(apartment)}
                className="px-4 py-2 text-sm font-medium text-morent-navy bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                title="Редактировать"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              
              <button
                onClick={() => handleDelete(apartment.id, apartment.title)}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
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
  );
};

export default ApartmentsList;