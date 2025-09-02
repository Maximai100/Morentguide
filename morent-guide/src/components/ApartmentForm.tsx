import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import MediaUploader from './MediaUploader';
import type { Apartment } from '../types';
import { apartmentApi } from '../utils/api';

interface ApartmentFormProps {
  apartment?: Apartment;
  onSave: (apartment: Apartment) => void;
  onCancel: () => void;
}

const ApartmentForm: React.FC<ApartmentFormProps> = ({
  apartment,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<Apartment>>({
    title: '',
    description: '',
    base_address: '',
    building_number: '',
    apartment_number: '',
    code_building: '',
    code_lock: '',
    wifi_name: '',
    wifi_password: '',
    manager_name: '',
    manager_phone: '',
    manager_email: '',
    photos: [],
    video_instructions: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (apartment) {
      setFormData(apartment);
    }
  }, [apartment]);

  const handleInputChange = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Очищаем ошибку для этого поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotosChange = (photos: string[]) => {
    setFormData(prev => ({ ...prev, photos }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Название обязательно';
    }

    if (!formData.base_address?.trim()) {
      newErrors.base_address = 'Адрес обязателен';
    }

    if (!formData.building_number?.trim()) {
      newErrors.building_number = 'Номер корпуса обязателен';
    }

    if (!formData.apartment_number?.trim()) {
      newErrors.apartment_number = 'Номер апартамента обязателен';
    }

    if (!formData.manager_name?.trim()) {
      newErrors.manager_name = 'Имя менеджера обязательно';
    }

    if (!formData.manager_phone?.trim()) {
      newErrors.manager_phone = 'Телефон менеджера обязателен';
    }

    if (!formData.manager_email?.trim()) {
      newErrors.manager_email = 'Email менеджера обязателен';
    }

    // Валидация email
    if (formData.manager_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.manager_email)) {
      newErrors.manager_email = 'Неверный формат email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      let savedApartment: Apartment;

      if (apartment?.id) {
        // Обновление существующего
        savedApartment = await apartmentApi.update(apartment.id, formData as Apartment);
      } else {
        // Создание нового
        savedApartment = await apartmentApi.create(formData as Omit<Apartment, 'id'>);
      }

      onSave(savedApartment);
    } catch (error) {
      console.error('Error saving apartment:', error);
      setErrors({ submit: 'Ошибка при сохранении апартамента' });
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!apartment?.id;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">
          {isEditing ? 'Редактировать апартамент' : 'Добавить апартамент'}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          {isEditing ? 'Внесите изменения в информацию об апартаменте' : 'Заполните информацию о новом апартаменте'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основная информация */}
        <div className="card-simple p-6">
          <h3 className="text-lg font-heading font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Основная информация
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Название апартамента"
              name="title"
              value={formData.title || ''}
              onChange={(value) => handleInputChange('title', value)}
              placeholder="Название апартамента"
              required
              error={errors.title}
            />
            
            <FormField
              label="Описание"
              name="description"
              type="textarea"
              value={formData.description || ''}
              onChange={(value) => handleInputChange('description', value)}
              placeholder="Описание апартамента"
              rows={3}
            />
          </div>
        </div>

        {/* Адрес */}
        <div className="card-simple p-6">
          <h3 className="text-lg font-heading font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Адрес
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Базовый адрес"
              name="base_address"
              value={formData.base_address || ''}
              onChange={(value) => handleInputChange('base_address', value)}
              placeholder="Улица, район"
              required
              error={errors.base_address}
            />
            
            <FormField
              label="Номер корпуса"
              name="building_number"
              value={formData.building_number || ''}
              onChange={(value) => handleInputChange('building_number', value)}
              placeholder="Корпус"
              required
              error={errors.building_number}
            />
            
            <FormField
              label="Номер апартамента"
              name="apartment_number"
              value={formData.apartment_number || ''}
              onChange={(value) => handleInputChange('apartment_number', value)}
              placeholder="Квартира"
              required
              error={errors.apartment_number}
            />
          </div>
        </div>

        {/* Доступ */}
        <div className="card-simple p-6">
          <h3 className="text-lg font-heading font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Доступ и Wi-Fi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Код подъезда"
              name="code_building"
              value={formData.code_building || ''}
              onChange={(value) => handleInputChange('code_building', value)}
              placeholder="Код для входа в подъезд"
            />
            
            <FormField
              label="Код замка"
              name="code_lock"
              value={formData.code_lock || ''}
              onChange={(value) => handleInputChange('code_lock', value)}
              placeholder="Код для входа в квартиру"
            />
            
            <FormField
              label="Название Wi-Fi сети"
              name="wifi_name"
              value={formData.wifi_name || ''}
              onChange={(value) => handleInputChange('wifi_name', value)}
              placeholder="Название Wi-Fi сети"
            />
            
            <FormField
              label="Пароль Wi-Fi"
              name="wifi_password"
              type="password"
              value={formData.wifi_password || ''}
              onChange={(value) => handleInputChange('wifi_password', value)}
              placeholder="Пароль от Wi-Fi"
            />
          </div>
        </div>

        {/* Менеджер */}
        <div className="card-simple p-6">
          <h3 className="text-lg font-heading font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Контакты менеджера
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Имя менеджера"
              name="manager_name"
              value={formData.manager_name || ''}
              onChange={(value) => handleInputChange('manager_name', value)}
              placeholder="Имя менеджера"
              required
              error={errors.manager_name}
            />
            
            <FormField
              label="Телефон"
              name="manager_phone"
              type="tel"
              value={formData.manager_phone || ''}
              onChange={(value) => handleInputChange('manager_phone', value)}
              placeholder="+7 (999) 123-45-67"
              required
              error={errors.manager_phone}
            />
            
            <FormField
              label="Email"
              name="manager_email"
              type="email"
              value={formData.manager_email || ''}
              onChange={(value) => handleInputChange('manager_email', value)}
              placeholder="manager@example.com"
              required
              error={errors.manager_email}
            />
          </div>
        </div>

        {/* Медиа */}
        <div className="card-simple p-6">
          <h3 className="text-lg font-heading font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Фотографии и видео
          </h3>
          <div className="space-y-4">
            <MediaUploader
              files={formData.photos || []}
              onFilesChange={handlePhotosChange}
              accept="image/*"
              multiple
              label="Загрузить фотографии"
            />
            
            <FormField
              label="Ссылка на видео-инструкцию"
              name="video_instructions"
              type="url"
              value={formData.video_instructions || ''}
              onChange={(value) => handleInputChange('video_instructions', value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
        </div>

        {/* Ошибка отправки */}
        {errors.submit && (
          <div className="card-simple p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 text-sm">
              {errors.submit}
            </p>
          </div>
        )}

        {/* Кнопки */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Отмена
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="spinner spinner-sm"></div>
                <span>Сохранение...</span>
              </div>
            ) : (
              <span>{isEditing ? 'Сохранить изменения' : 'Добавить апартамент'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApartmentForm;