import React, { useState, useEffect } from 'react';
import type { Apartment } from '../types';
import { apartmentApi } from '../utils/api';
import MediaUploader from './MediaUploader';
import FormField from './FormField';
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (apartment) {
      setFormData(apartment);
    }
  }, [apartment]);

  const handleInputChange = (field: keyof Apartment, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => { // Clear error for this field
      const newErrors = { ...prev };
      delete newErrors[field as string]; // Cast to string as keyof Apartment can be symbol/number
      return newErrors;
    });
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

      

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основная информация */}
        <div className="card-enhanced p-6">
          <h3 className="text-lg font-semibold mb-4">Основная информация</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              label="Название апартамента *"
              name="title"
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Например: Апартаменты Морент"
              required
              error={errors.title}
            />
            <FormField
              label="Номер апартамента *"
              name="apartment_number"
              type="text"
              value={formData.apartment_number || ''}
              onChange={(e) => handleInputChange('apartment_number', e.target.value)}
              placeholder="101"
              required
              error={errors.apartment_number}
            />
            <FormField
              label="Номер корпуса *"
              name="building_number"
              type="text"
              value={formData.building_number || ''}
              onChange={(e) => handleInputChange('building_number', e.target.value)}
              placeholder="А"
              required
              error={errors.building_number}
            />
            <FormField
              label="Базовый адрес *"
              name="base_address"
              type="text"
              value={formData.base_address || ''}
              onChange={(e) => handleInputChange('base_address', e.target.value)}
              placeholder="Нагорный тупик 13"
              required
              error={errors.base_address}
            />
          </div>
          <FormField
            label="Описание"
            name="description"
            type="textarea"
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            placeholder="Описание апартаментов..."
            error={errors.description}
          />
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
            <FormField
              label="Название Wi-Fi *"
              name="wifi_name"
              type="text"
              value={formData.wifi_name || ''}
              onChange={(e) => handleInputChange('wifi_name', e.target.value)}
              placeholder="WiFi_Morent"
              required
              error={errors.wifi_name}
            />
            <FormField
              label="Пароль Wi-Fi *"
              name="wifi_password"
              type="text"
              value={formData.wifi_password || ''}
              onChange={(e) => handleInputChange('wifi_password', e.target.value)}
              placeholder="123Morent"
              required
              error={errors.wifi_password}
            />
            <FormField
              label="Код подъезда *"
              name="code_building"
              type="text"
              value={formData.code_building || ''}
              onChange={(e) => handleInputChange('code_building', e.target.value)}
              placeholder="#2020"
              required
              error={errors.code_building}
            />
            <FormField
              label="Код замка *"
              name="code_lock"
              type="text"
              value={formData.code_lock || ''}
              onChange={(e) => handleInputChange('code_lock', e.target.value)}
              placeholder="#101"
              required
              error={errors.code_lock}
            />
          </div>
        </div>

        {/* FAQ */}
        <div className="card-enhanced p-6">
          <h3 className="text-lg font-semibold mb-4">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <FormField
              label="FAQ по заселению"
              name="faq_checkin"
              type="textarea"
              value={formData.faq_checkin || ''}
              onChange={(e) => handleInputChange('faq_checkin', e.target.value)}
              rows={4}
              placeholder="Инструкции по заселению..."
              error={errors.faq_checkin}
            />
            <FormField
              label="FAQ по апартаментам"
              name="faq_apartment"
              type="textarea"
              value={formData.faq_apartment || ''}
              onChange={(e) => handleInputChange('faq_apartment', e.target.value)}
              rows={4}
              placeholder="Информация об апартаментах..."
              error={errors.faq_apartment}
            />
            <FormField
              label="FAQ по району"
              name="faq_area"
              type="textarea"
              value={formData.faq_area || ''}
              onChange={(e) => handleInputChange('faq_area', e.target.value)}
              rows={4}
              placeholder="Информация о районе..."
              error={errors.faq_area}
            />
          </div>
        </div>

        {/* Карта */}
        <div className="card-enhanced p-6">
          <h3 className="text-lg font-semibold mb-4">Карта</h3>
          <FormField
            label="Код вставки Яндекс.Карт"
            name="map_embed_code"
            type="textarea"
            value={formData.map_embed_code || ''}
            onChange={(e) => handleInputChange('map_embed_code', e.target.value)}
            rows={3}
            placeholder='<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A123456789&amp;source=constructor" width="100%" height="400" frameborder="0"></iframe>'
            error={errors.map_embed_code}
          />
        </div>

        {/* Контакты менеджера */}
        <div className="card-enhanced p-6">
          <h3 className="text-lg font-semibold mb-4">Контакты менеджера</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              label="Имя менеджера *"
              name="manager_name"
              type="text"
              value={formData.manager_name || ''}
              onChange={(e) => handleInputChange('manager_name', e.target.value)}
              placeholder="Менеджер Морент"
              required
              error={errors.manager_name}
            />
            <FormField
              label="Телефон *"
              name="manager_phone"
              type="tel"
              value={formData.manager_phone || ''}
              onChange={(e) => handleInputChange('manager_phone', e.target.value)}
              placeholder="88007005501"
              required
              error={errors.manager_phone}
            />
            <FormField
              label="Email *"
              name="manager_email"
              type="email"
              value={formData.manager_email || ''}
              onChange={(e) => handleInputChange('manager_email', e.target.value)}
              placeholder="morent@mail.ru"
              required
              error={errors.manager_email}
            />
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