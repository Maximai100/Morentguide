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
      <div className="text-center py-8 text-gray-500">
        Загрузка апартаментов...
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-simple p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadApartments}
          className="btn-primary"
          >
          Попробовать снова
          </button>
      </div>
    );
  }

  if (apartments.length === 0) {
    return (
      <div className="card-simple p-8 text-center">
        <p className="text-gray-500 mb-4">Ошибка загрузки апартаментов</p>
        <button 
          onClick={loadApartments}
          className="btn-primary"
        >
          Попробовать снова
          </button>
      </div>
    );
  }

  return (
      <div className="space-y-4">
      {apartments.map((apartment) => (
        <div key={apartment.id} className="card-simple p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
              <h3 className="text-lg font-medium mb-2">
                    {apartment.title}
                  </h3>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Адрес:</strong> {getFullAddress(apartment)}</p>
                {apartment.wifi_name && (
                  <p><strong>Wi-Fi:</strong> {apartment.wifi_name}</p>
                )}
                {apartment.code_building && (
                  <p><strong>Код подъезда:</strong> {apartment.code_building}</p>
                )}
                {apartment.manager_name && (
                  <p><strong>Менеджер:</strong> {apartment.manager_name}</p>
                )}
              </div>
              </div>

            <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => onEdit(apartment)}
                className="btn-secondary text-sm"
                >
                Редактировать
                </button>
                
                <button
                  onClick={() => handleDelete(apartment.id, apartment.title)}
                className="btn-danger text-sm"
                >
                Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ApartmentsList;