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
    title: apartment?.title || 'Апартаменты Морент',
    apartment_number: apartment?.apartment_number || '',
    building_number: apartment?.building_number || '',
    base_address: apartment?.base_address || 'Нагорный тупик 13',
    description: apartment?.description || '',
    photos: apartment?.photos || [],
    video_entrance: apartment?.video_entrance || null,
    video_lock: apartment?.video_lock || null,
    wifi_name: apartment?.wifi_name || '',
    wifi_password: apartment?.wifi_password || '',
    code_building: apartment?.code_building || '',
    code_lock: apartment?.code_lock || '',
    faq_checkin: apartment?.faq_checkin || '',
    faq_apartment: apartment?.faq_apartment || '',
    faq_area: apartment?.faq_area || '',
    map_embed_code: apartment?.map_embed_code || '<iframe src="https://yandex.ru/map-widget/v1/?ll=39.931606%2C43.416658&amp;z=16&amp;l=map&amp;pt=39.931606%2C43.416658%2Cpm2rdm" width="100%" height="400" frameborder="0"></iframe>',
    manager_name: apartment?.manager_name || 'Максим',
    manager_phone: apartment?.manager_phone || '+7 (918) 123-45-67',
    manager_email: apartment?.manager_email || 'maxim.tkachuk@bk.ru'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dataToSave = apartment 
        ? { ...formData, id: apartment.id }
        : formData;
      
      console.log('Saving apartment data:', dataToSave);
      console.log('Form data keys:', Object.keys(dataToSave));
      console.log('Form data values:', Object.values(dataToSave));
      await onSave(dataToSave);
      console.log('Apartment saved successfully');
    } catch (error) {
      console.error('Error creating apartment:', error);
      alert(`Детальная ошибка: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log('Input change:', name, value);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="form-card p-6 max-w-4xl mx-auto">
      <h3 className="form-title">
        {apartment ? 'Редактировать апартамент' : 'Добавить новый апартамент'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основная информация */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">
              Название апартамента
            </label>
                         <input
               type="text"
               name="title"
               value={formData.title}
               onChange={handleInputChange}
               className="input-morent"
               placeholder="Морской бриз 101"
               required
               disabled={isLoading}
               autoFocus
             />
          </div>

          <div>
            <label className="form-label">
              Номер апартамента
            </label>
                         <input
               type="text"
               name="apartment_number"
               value={formData.apartment_number}
               onChange={handleInputChange}
               className="input-morent"
               placeholder="101"
               required
               disabled={isLoading}
             />
          </div>

          <div>
            <label className="form-label">
              Номер корпуса
            </label>
                         <input
               type="text"
               name="building_number"
               value={formData.building_number}
               onChange={handleInputChange}
               className="input-morent"
               placeholder="1"
               required
               disabled={isLoading}
             />
          </div>

          <div>
            <label className="form-label">
              Базовый адрес
            </label>
                         <input
               type="text"
               name="base_address"
               value={formData.base_address}
               onChange={handleInputChange}
               className="input-morent"
               required
               disabled={isLoading}
             />
          </div>
                 </div>
 
         {/* Медиа файлы */}
         <div className="form-section">
           <h4 className="form-subtitle">Медиа файлы</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <MediaUploader
               label="Фотографии апартамента"
               value={formData.photos as string}
               onChange={(value) => setFormData(prev => ({ ...prev, photos: value }))}
               accept="image/*"
             />
             
             <MediaUploader
               label="Видео входа"
               value={formData.video_entrance || null}
               onChange={(value) => setFormData(prev => ({ ...prev, video_entrance: value }))}
               accept="video/*"
             />
             
             <MediaUploader
               label="Видео замка"
               value={formData.video_lock || null}
               onChange={(value) => setFormData(prev => ({ ...prev, video_lock: value }))}
               accept="video/*"
             />
           </div>
         </div>
 
         {/* Описание */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Описание
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="input-morent"
            placeholder="Комфортные апартаменты у моря..."
            required
          />
        </div>

        {/* WiFi и коды доступа */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">
              Название Wi-Fi
            </label>
            <input
              type="text"
              name="wifi_name"
              value={formData.wifi_name}
              onChange={handleInputChange}
              className="input-morent"
              required
            />
          </div>

          <div>
            <label className="form-label">
              Пароль Wi-Fi
            </label>
            <input
              type="text"
              name="wifi_password"
              value={formData.wifi_password}
              onChange={handleInputChange}
              className="input-morent"
              required
            />
          </div>

          <div>
            <label className="form-label">
              Код от подъезда
            </label>
            <input
              type="text"
              name="code_building"
              value={formData.code_building}
              onChange={handleInputChange}
              className="input-morent"
              required
            />
          </div>

          <div>
            <label className="form-label">
              Код от замка
            </label>
            <input
              type="text"
              name="code_lock"
              value={formData.code_lock}
              onChange={handleInputChange}
              className="input-morent"
              required
            />
          </div>
        </div>

        {/* FAQ секции */}
        <div className="form-section space-y-4">
          <h4 className="form-subtitle">FAQ секции</h4>
          
          <div>
            <label className="form-label">
              FAQ по заселению
            </label>
            <textarea
              name="faq_checkin"
              value={formData.faq_checkin}
              onChange={handleInputChange}
              rows={3}
              className="input-morent"
              placeholder="Время заселения с 14:00..."
            />
          </div>

          <div>
            <label className="form-label">
              FAQ по апартаменту
            </label>
            <textarea
              name="faq_apartment"
              value={formData.faq_apartment}
              onChange={handleInputChange}
              rows={3}
              className="input-morent"
              placeholder="В апартаменте есть..."
            />
          </div>

          <div>
            <label className="form-label">
              FAQ по району
            </label>
            <textarea
              name="faq_area"
              value={formData.faq_area}
              onChange={handleInputChange}
              rows={3}
              className="input-morent"
              placeholder="В районе находятся..."
            />
          </div>
        </div>

        {/* Автоматическая карта */}
        <div className="form-section">
          <h4 className="form-subtitle">Карта</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              Карта автоматически отображает адрес: <strong>Нагорный тупик 13Б</strong>
            </p>
            <div className="bg-white p-2 rounded border">
              <div className="text-xs text-gray-500">Координаты: 43.416658, 39.931606</div>
            </div>
          </div>
        </div>

        {/* Контакты менеджера */}
        <div className="form-section">
          <h4 className="form-subtitle">Контакты менеджера</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="form-label">
              Имя менеджера
            </label>
            <input
              type="text"
              name="manager_name"
              value={formData.manager_name}
              onChange={handleInputChange}
              className="input-morent"
              required
            />
          </div>

          <div>
            <label className="form-label">
              Телефон менеджера
            </label>
            <input
              type="text"
              name="manager_phone"
              value={formData.manager_phone}
              onChange={handleInputChange}
              className="input-morent"
              required
            />
          </div>

          <div>
            <label className="form-label">
              Email менеджера
            </label>
            <input
              type="email"
              name="manager_email"
              value={formData.manager_email}
              onChange={handleInputChange}
              className="input-morent"
              required
            />
          </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
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