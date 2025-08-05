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
  const [currentStep, setCurrentStep] = useState(1);
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

  const steps = [
    { number: 1, title: 'Основная информация', icon: '��' },
    { number: 2, title: 'Доступ и Wi-Fi', icon: '��' },
    { number: 3, title: 'Менеджер и контакты', icon: '👤' }
  ];

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="form-card p-6 max-w-4xl mx-auto animate-fade-in">
      <h3 className="form-title">
        {apartment ? 'Редактировать апартамент' : 'Добавить новый апартамент'}
      </h3>

      {/* Прогресс-бар */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step.number 
                  ? 'bg-morent-navy text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step.number ? '✓' : step.number}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-2 ${
                  currentStep > step.number ? 'bg-morent-navy' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h4 className="text-lg font-medium text-gray-900">
            {steps[currentStep - 1].icon} {steps[currentStep - 1].title}
          </h4>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Шаг 1: Основная информация */}
        {currentStep === 1 && (
          <div className="animate-scale-in">
            <div className="notification-info mb-6">
              <p className="text-sm">Заполните основную информацию об апартаменте</p>
            </div>
            
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
                  className="input-enhanced"
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
                  className="input-enhanced"
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
                  className="input-enhanced"
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
                  className="input-enhanced"
                  placeholder="Нагорный тупик 13"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="form-label">
                Описание
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input-enhanced"
                placeholder="Описание апартамента..."
                rows={4}
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {/* Шаг 2: Доступ и Wi-Fi */}
        {currentStep === 2 && (
          <div className="animate-scale-in">
            <div className="notification-info mb-6">
              <p className="text-sm">Укажите информацию для доступа и подключения</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">
                  Название Wi-Fi сети
                </label>
                <input
                  type="text"
                  name="wifi_name"
                  value={formData.wifi_name}
                  onChange={handleInputChange}
                  className="input-enhanced"
                  placeholder="MORENT_WiFi"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="form-label">
                  Пароль Wi-Fi
                </label>
                <input
                  type="password"
                  name="wifi_password"
                  value={formData.wifi_password}
                  onChange={handleInputChange}
                  className="input-enhanced"
                  placeholder="password123"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="form-label">
                  Код подъезда
                </label>
                <input
                  type="text"
                  name="code_building"
                  value={formData.code_building}
                  onChange={handleInputChange}
                  className="input-enhanced"
                  placeholder="1234"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="form-label">
                  Код замка
                </label>
                <input
                  type="text"
                  name="code_lock"
                  value={formData.code_lock}
                  onChange={handleInputChange}
                  className="input-enhanced"
                  placeholder="5678"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Шаг 3: Менеджер и контакты */}
        {currentStep === 3 && (
          <div className="animate-scale-in">
            <div className="notification-info mb-6">
              <p className="text-sm">Укажите контактную информацию менеджера</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">
                  Имя менеджера
                </label>
                <input
                  type="text"
                  name="manager_name"
                  value={formData.manager_name}
                  onChange={handleInputChange}
                  className="input-enhanced"
                  placeholder="Максим"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="form-label">
                  Телефон менеджера
                </label>
                <input
                  type="tel"
                  name="manager_phone"
                  value={formData.manager_phone}
                  onChange={handleInputChange}
                  className="input-enhanced"
                  placeholder="+7 (918) 123-45-67"
                  disabled={isLoading}
                />
              </div>

              <div className="md:col-span-2">
                <label className="form-label">
                  Email менеджера
                </label>
                <input
                  type="email"
                  name="manager_email"
                  value={formData.manager_email}
                  onChange={handleInputChange}
                  className="input-enhanced"
                  placeholder="maxim.tkachuk@bk.ru"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Предварительный просмотр контактов */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Предварительный просмотр контактов:</h4>
              <div className="text-sm text-blue-800">
                <p><strong>Менеджер:</strong> {formData.manager_name}</p>
                <p><strong>Телефон:</strong> {formData.manager_phone}</p>
                <p><strong>Email:</strong> {formData.manager_email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Кнопки навигации */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Назад
          </button>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
              disabled={isLoading}
            >
              Отмена
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-gradient"
                disabled={isLoading}
              >
                Далее →
              </button>
            ) : (
              <button
                type="submit"
                className="btn-coral-gradient"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="loading-spinner"></div>
                    <span>Сохранение...</span>
                  </div>
                ) : (
                  '💾 Сохранить апартамент'
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ApartmentForm;
