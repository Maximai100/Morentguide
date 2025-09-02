import React, { useState, useEffect } from 'react';
import type { Apartment } from '../types';
import { apartmentApi } from '../utils/api';

// Компонент для dropdown действий
const ActionsDropdown: React.FC<{
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ isOpen, onToggle, onEdit, onDelete }) => {
  return (
    <div className={`actions-dropdown ${isOpen ? 'open' : ''}`}>
      <button
        onClick={onToggle}
        className="actions-dropdown-button group"
        aria-label="Действия"
      >
        <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="19" cy="12" r="1"></circle>
          <circle cx="5" cy="12" r="1"></circle>
        </svg>
      </button>
      
      <div className="actions-dropdown-menu">
        <button
          onClick={() => {
            onEdit();
            onToggle();
          }}
          className="actions-dropdown-item w-full text-left"
        >
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Редактировать
        </button>
        
        <button
          onClick={() => {
            onDelete();
            onToggle();
          }}
          className="actions-dropdown-item w-full text-left text-red-600 dark:text-red-400"
        >
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Удалить
        </button>
      </div>
    </div>
  );
};

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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

  // Закрываем dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && !(event.target as Element).closest('.actions-dropdown')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

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
        <p className="text-gray-500 mb-4">Нет доступных апартаментов. Добавьте новый апартамент, чтобы начать.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {apartments.map((apartment) => (
        <div key={apartment.id} className="card-enhanced group animate-fade-in">
          <div className="card-body">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {apartment.title}
              </h3>
              
              <ActionsDropdown
                isOpen={openDropdown === apartment.id}
                onToggle={() => setOpenDropdown(openDropdown === apartment.id ? null : apartment.id)}
                onEdit={() => onEdit(apartment)}
                onDelete={() => handleDelete(apartment.id, apartment.title)}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {getFullAddress(apartment)}
                </p>
              </div>
              
              {apartment.wifi_name && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Wi-Fi:</span> {apartment.wifi_name}
                  </span>
                </div>
              )}
              
              {apartment.code_building && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Код:</span> {apartment.code_building}
                  </span>
                </div>
              )}
              
              {apartment.manager_name && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Менеджер:</span> {apartment.manager_name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApartmentsList;