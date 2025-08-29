import React, { useState, useEffect } from 'react';
import type { Apartment } from '../types';
import { apartmentApi } from '../utils/api';
import MediaUploader from './MediaUploader';
import { validateApartment, showNotification } from '../utils/helpers';

interface ApartmentFormProps {
  apartment?: Apartment;
  onSave: (apartment: Apartment) => void;
  onCancel: () => void;
}

const ApartmentForm: React.FC<ApartmentFormProps> = ({ apartment, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Apartment>>({
    title: '',
    apartment_number: '',
    building_number: '',
    base_address: '',
    description: '',
    photos: [],
    video_entrance: '',
    video_lock: '',
    wifi_name: '',
    wifi_password: '',
    code_building: '',
    code_lock: '',
    faq_checkin: '',
    faq_apartment: '',
    faq_area: '',
    map_embed_code: '',
    manager_name: '',
    manager_phone: '',
    manager_email: '',
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (apartment) {
      setFormData(apartment);
    }
  }, [apartment]);

  const handleInputChange = (field: keyof Apartment, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибки при изменении поля
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация формы
    const validation = validateApartment(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
      return;
    }

    setIsLoading(true);
    try {
      let savedApartment: Apartment;
      
      if (apartment?.id) {
        // Обновление существующего апартамента
        savedApartment = await apartmentApi.update(apartment.id, formData);
        showNotification('Апартамент успешно обновлен', 'success');
      } else {
        // Создание нового апартамента
        savedApartment = await apartmentApi.create(formData as Omit<Apartment, 'id'>);
        showNotification('Апартамент успешно создан', 'success');
      }
      
      onSave(savedApartment);
    } catch (error) {
      console.error('Failed to save apartment:', error);
      showNotification('Ошибка при сохранении апартамента', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold">
          {apartment ? 'Редактировать апартамент' : 'Добавить апартамент'}
        </h2>
      </div>

      {/* Отображение ошибок */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold mb-2">Ошибки в форме:</h3>
          <ul className="list-disc list-inside text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основная информация */}
        <div className="card-enhanced p-6">
          <h3 className="text-lg font-semibold mb-4">Основная информация</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название апартамента *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="input-field"
                placeholder="Например: Апартаменты Морент"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Номер апартамента *
              </label>
              <input
                type="text"
                value={formData.apartment_number || ''}
                onChange={(e) => handleInputChange('apartment_number', e.target.value)}
                className="input-field"
                placeholder="101"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Номер корпуса *
              </label>
              <input
                type="text"
                value={formData.building_number || ''}
                onChange={(e) => handleInputChange('building_number', e.target.value)}
                className="input-field"
                placeholder="А"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Базовый адрес *
              </label>
              <input
                type="text"
                value={formData.base_address || ''}
                onChange={(e) => handleInputChange('base_address', e.target.value)}
                className="input-field"
                placeholder="Нагорный тупик 13"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="input-field"
              rows={3}
              placeholder="Описание апартаментов..."
            />
          </div>
        </div>

        {/* Медиа файлы */}
        <div className="card-enhanced p-6">
          <h3 className="text-lg font-semibold mb-4">Медиа файлы</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Фотографии
              </label>
              <MediaUploader
                files={Array.isArray(formData.photos) ? formData.photos : []}
                onFilesChange={(files) => handleInputChange('photos', files)}
                accept="image/*"
                multiple={true}
                label="Выбрать фотографии"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Видео подъезда
                </label>
                <MediaUploader
                  files={formData.video_entrance ? [formData.video_entrance] : []}
                  onFilesChange={(files) => handleInputChange('video_entrance', files[0] || '')}
                  accept="video/*"
                  multiple={false}
                  label="Выбрать видео"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Видео замка
                </label>
                <MediaUploader
                  files={formData.video_lock ? [formData.video_lock] : []}
                  onFilesChange={(files) => handleInputChange('video_lock', files[0] || '')}
                  accept="video/*"
                  multiple={false}
                  label="Выбрать видео"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Доступ */}
        <div className="card-enhanced p-6">
          <h3 className="text-lg font-semibold mb-4">Доступ</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название Wi-Fi *
              </label>
              <input
                type="text"
                value={formData.wifi_name || ''}
                onChange={(e) => handleInputChange('wifi_name', e.target.value)}
                className="input-field"
                placeholder="WiFi_Morent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пароль Wi-Fi *
              </label>
              <input
                type="text"
                value={formData.wifi_password || ''}
                onChange={(e) => handleInputChange('wifi_password', e.target.value)}
                className="input-field"
                placeholder="123Morent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Код подъезда *
              </label>
              <input
                type="text"
                value={formData.code_building || ''}
                onChange={(e) => handleInputChange('code_building', e.target.value)}
                className="input-field"
                placeholder="#2020"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Код замка *
              </label>
              <input
                type="text"
                value={formData.code_lock || ''}
                onChange={(e) => handleInputChange('code_lock', e.target.value)}
                className="input-field"
                placeholder="#101"
                required
              />
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="card-enhanced p-6">
          <h3 className="text-lg font-semibold mb-4">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                FAQ по заселению
              </label>
              <textarea
                value={formData.faq_checkin || ''}
                onChange={(e) => handleInputChange('faq_checkin', e.target.value)}
                className="input-field"
                rows={4}
                placeholder="Инструкции по заселению..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                FAQ по апартаментам
              </label>
              <textarea
                value={formData.faq_apartment || ''}
                onChange={(e) => handleInputChange('faq_apartment', e.target.value)}
                className="input-field"
                rows={4}
                placeholder="Информация об апартаментах..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                FAQ по району
              </label>
              <textarea
                value={formData.faq_area || ''}
                onChange={(e) => handleInputChange('faq_area', e.target.value)}
                className="input-field"
                rows={4}
                placeholder="Информация о районе..."
              />
            </div>
          </div>
        </div>

        {/* Карта */}
        <div className="card-enhanced p-6">
          <h3 className="text-lg font-semibold mb-4">Карта</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Код вставки Яндекс.Карт
            </label>
            <textarea
              value={formData.map_embed_code || ''}
              onChange={(e) => handleInputChange('map_embed_code', e.target.value)}
              className="input-field"
              rows={3}
              placeholder='<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A123456789&amp;source=constructor" width="100%" height="400" frameborder="0"></iframe>'
            />
          </div>
        </div>

        {/* Контакты менеджера */}
        <div className="card-enhanced p-6">
          <h3 className="text-lg font-semibold mb-4">Контакты менеджера</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Имя менеджера *
              </label>
              <input
                type="text"
                value={formData.manager_name || ''}
                onChange={(e) => handleInputChange('manager_name', e.target.value)}
                className="input-field"
                placeholder="Менеджер Морент"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Телефон *
              </label>
              <input
                type="tel"
                value={formData.manager_phone || ''}
                onChange={(e) => handleInputChange('manager_phone', e.target.value)}
                className="input-field"
                placeholder="88007005501"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.manager_email || ''}
                onChange={(e) => handleInputChange('manager_email', e.target.value)}
                className="input-field"
                placeholder="morent@mail.ru"
                required
              />
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={isLoading}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Сохранение...' : (apartment ? 'Обновить' : 'Создать')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApartmentForm;