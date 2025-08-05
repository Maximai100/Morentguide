import React, { useState } from 'react';
import type { Apartment } from '../types';
import MediaUploader from './MediaUploader';

interface ApartmentFormProps {
  apartment?: Apartment;
  onSave: (apartment: Omit<Apartment, 'id'> | Apartment) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ApartmentForm: React.FC<ApartmentFormProps> = ({
  apartment,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Omit<Apartment, 'id'>>({
    title: apartment?.title || '',
    apartment_number: apartment?.apartment_number || '',
    building_number: apartment?.building_number || '',
    base_address: apartment?.base_address || 'Нагорный тупик 13',
    description: apartment?.description || '',
    photos: Array.isArray(apartment?.photos) ? apartment.photos : [],
    video_entrance: apartment?.video_entrance || null,
    video_lock: apartment?.video_lock || null,
    wifi_name: apartment?.wifi_name || '',
    wifi_password: apartment?.wifi_password || '',
    code_building: apartment?.code_building || '',
    code_lock: apartment?.code_lock || '',
    faq_checkin: apartment?.faq_checkin || '',
    faq_apartment: apartment?.faq_apartment || '',
    faq_area: apartment?.faq_area || '',
    map_embed_code: apartment?.map_embed_code || '',
    manager_name: apartment?.manager_name || '',
    manager_phone: apartment?.manager_phone || '',
    manager_email: apartment?.manager_email || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dataToSave = apartment 
        ? { ...formData, id: apartment.id }
        : formData;
      
      await onSave(dataToSave);
    } catch (error) {
      console.error('Error saving apartment:', error);
      alert('Ошибка при сохранении апартамента');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="card-simple p-6">
      <h3 className="text-xl font-heading font-semibold mb-6">
        {apartment ? 'Редактировать апартамент' : 'Добавить новый апартамент'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основная информация */}
        <div>
          <h4 className="text-lg font-heading font-medium mb-4">Основная информация</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название апартамента
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input-simple"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Номер апартамента
              </label>
              <input
                type="text"
                name="apartment_number"
                value={formData.apartment_number}
                onChange={handleInputChange}
                className="input-simple"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Номер корпуса
              </label>
              <input
                type="text"
                name="building_number"
                value={formData.building_number}
                onChange={handleInputChange}
                className="input-simple"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Базовый адрес
              </label>
              <input
                type="text"
                name="base_address"
                value={formData.base_address}
                onChange={handleInputChange}
                className="input-simple"
                required
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="input-simple"
            />
          </div>
        </div>

        {/* Медиафайлы */}
        <div>
          <h4 className="text-lg font-heading font-medium mb-4">Медиафайлы</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Фотографии апартамента
              </label>
              <MediaUploader
                files={Array.isArray(formData.photos) ? formData.photos : []}
                onFilesChange={(files) => setFormData(prev => ({ ...prev, photos: files }))}
                accept="image/*"
                multiple
                label="Выбрать фото"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Видео входа
              </label>
              <MediaUploader
                files={formData.video_entrance ? [formData.video_entrance] : []}
                onFilesChange={(files) => setFormData(prev => ({ ...prev, video_entrance: files[0] || null }))}
                accept="video/*"
                multiple={false}
                label="Выбрать видео"
              />
            </div>
          </div>
        </div>

        {/* Доступ и коды */}
        <div>
          <h4 className="text-lg font-heading font-medium mb-4">Доступ и коды</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название Wi-Fi
              </label>
              <input
                type="text"
                name="wifi_name"
                value={formData.wifi_name}
                onChange={handleInputChange}
                className="input-simple"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пароль Wi-Fi
              </label>
              <input
                type="text"
                name="wifi_password"
                value={formData.wifi_password}
                onChange={handleInputChange}
                className="input-simple"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Код подъезда
              </label>
              <input
                type="text"
                name="code_building"
                value={formData.code_building}
                onChange={handleInputChange}
                className="input-simple"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Код замка
              </label>
              <input
                type="text"
                name="code_lock"
                value={formData.code_lock}
                onChange={handleInputChange}
                className="input-simple"
              />
            </div>
          </div>
        </div>

        {/* Менеджер */}
        <div>
          <h4 className="text-lg font-heading font-medium mb-4">Менеджер</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя менеджера
              </label>
              <input
                type="text"
                name="manager_name"
                value={formData.manager_name}
                onChange={handleInputChange}
                className="input-simple"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Телефон менеджера
              </label>
              <input
                type="tel"
                name="manager_phone"
                value={formData.manager_phone}
                onChange={handleInputChange}
                className="input-simple"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email менеджера
              </label>
              <input
                type="email"
                name="manager_email"
                value={formData.manager_email}
                onChange={handleInputChange}
                className="input-simple"
              />
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
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
            {isLoading ? 'Сохранение...' : (apartment ? 'Сохранить' : 'Создать')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApartmentForm;