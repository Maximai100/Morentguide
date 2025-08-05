import React, { useState, useEffect } from 'react';
import type { Booking, Apartment } from '../types';
import { bookingApi, apartmentApi } from '../utils/api';
import { generateSlug } from '../utils/helpers';

interface BookingFormProps {
  booking?: Booking;
  onSave: (booking: Omit<Booking, 'id'> | Booking) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
  booking,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [isBookingCreated, setIsBookingCreated] = useState(false);
  const [customLockCode, setCustomLockCode] = useState('');
  
  const [formData, setFormData] = useState<Omit<Booking, 'id'>>({
    guest_name: booking?.guest_name || '',
    guest_phone: booking?.guest_phone || '',
    date_start: booking?.date_start || '',
    date_end: booking?.date_end || '',
    apartment_id: booking?.apartment_id || '',
    apartment_title: booking?.apartment_title || '',
    status: booking?.status || 'active',
    lock_code: booking?.lock_code || '',
    link: booking?.link || '',
    welcome_message: booking?.welcome_message || '',
  });

  useEffect(() => {
    loadApartments();
  }, []);

  useEffect(() => {
    if (formData.apartment_id) {
      const apartment = apartments.find(a => a.id === formData.apartment_id);
      if (apartment) {
        setSelectedApartment(apartment);
        setFormData(prev => ({
          ...prev,
          apartment_title: apartment.title
        }));
      }
    }
  }, [formData.apartment_id, apartments]);

  const loadApartments = async () => {
    try {
      const data = await apartmentApi.getAll();
      setApartments(data);
    } catch (err) {
      console.error('Error loading apartments:', err);
    }
  };

  const generateNewSlug = async () => {
    try {
      const slug = generateSlug();
      const link = `${window.location.origin}/booking/${slug}`;
      
      setFormData(prev => ({
        ...prev,
        link,
        lock_code: customLockCode || Math.random().toString(36).substring(2, 8).toUpperCase()
      }));

      // Создаем бронирование в Directus сразу
      const newBooking = {
        ...formData,
        link,
        lock_code: customLockCode || Math.random().toString(36).substring(2, 8).toUpperCase()
      };

      await bookingApi.create(newBooking);
      setIsBookingCreated(true);
    } catch (err) {
      console.error('Error generating slug:', err);
    }
  };

  const generateWelcomeMessage = () => {
    const message = `Здравствуйте, ${formData.guest_name}! Добро пожаловать в MORENT ��

Ваша персональная инструкция по заселению: ${formData.link}

Код доступа: ${formData.lock_code}

Ждем вас! ��`;
    
    setFormData(prev => ({ ...prev, welcome_message: message }));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Скопировано в буфер обмена!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sendToWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formData.guest_phone.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }
    
    try {
      await onSave(formData);
    } catch (err) {
      console.error('Error saving booking:', err);
    }
  };

  const steps = [
    { title: 'Информация о госте', icon: '��' },
    { title: 'Выбор апартамента', icon: '��' },
    { title: 'Создание ссылки', icon: '🔗' }
  ];

  return (
    <div className="form-card animate-fade-in">
      <div className="form-header">
        <h2 className="form-title">
          {booking ? 'Редактировать бронирование' : 'Создать новое бронирование'}
        </h2>
        
        {/* Прогресс-бар */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                  currentStep > index + 1 
                    ? 'bg-green-500 text-white' 
                    : currentStep === index + 1 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > index + 1 ? '✓' : index + 1}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {step.icon} {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Шаг 1: Информация о госте */}
        {currentStep === 1 && (
          <div className="animate-scale-in">
            <div className="glass-dark p-6 rounded-xl mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                �� Информация о госте
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Имя гостя *</label>
                  <input
                    type="text"
                    value={formData.guest_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, guest_name: e.target.value }))}
                    className="input-enhanced"
                    required
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="form-label">Телефон гостя *</label>
                  <input
                    type="tel"
                    value={formData.guest_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, guest_phone: e.target.value }))}
                    className="input-enhanced"
                    required
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Шаг 2: Выбор апартамента */}
        {currentStep === 2 && (
          <div className="animate-scale-in">
            <div className="glass-dark p-6 rounded-xl mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                �� Выбор апартамента
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Апартамент *</label>
                  <select
                    value={formData.apartment_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, apartment_id: e.target.value }))}
                    className="input-enhanced"
                    required
                  >
                    <option value="">Выберите апартамент</option>
                    {apartments.map(apartment => (
                      <option key={apartment.id} value={apartment.id}>
                        {apartment.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Статус</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="input-enhanced"
                  >
                    <option value="active">Активно</option>
                    <option value="completed">Завершено</option>
                    <option value="cancelled">Отменено</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="form-label">Дата заезда *</label>
                  <input
                    type="date"
                    value={formData.date_start}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_start: e.target.value }))}
                    className="input-enhanced"
                    required
                  />
                </div>
                
                <div>
                  <label className="form-label">Дата выезда *</label>
                  <input
                    type="date"
                    value={formData.date_end}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_end: e.target.value }))}
                    className="input-enhanced"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Превью выбранного апартамента */}
            {selectedApartment && (
              <div className="card-enhanced p-6 animate-fade-in">
                <h4 className="text-lg font-semibold mb-3">Выбранный апартамент:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Название:</strong> {selectedApartment.title}</p>
                    <p><strong>Адрес:</strong> {selectedApartment.base_address}</p>
                    <p><strong>Менеджер:</strong> {selectedApartment.manager_name}</p>
                  </div>
                  <div>
                    <p><strong>Телефон:</strong> {selectedApartment.manager_phone}</p>
                    <p><strong>WiFi:</strong> {selectedApartment.wifi_name}</p>
                    <p><strong>Пароль WiFi:</strong> {selectedApartment.wifi_password}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Шаг 3: Создание ссылки */}
        {currentStep === 3 && (
          <div className="animate-scale-in">
            <div className="glass-dark p-6 rounded-xl mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                🔗 Создание ссылки для гостя
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Код замка (опционально)</label>
                  <input
                    type="text"
                    value={customLockCode}
                    onChange={(e) => setCustomLockCode(e.target.value)}
                    className="input-enhanced"
                    placeholder="Автоматически сгенерируется"
                  />
                </div>
                
                <div>
                  <label className="form-label">Сгенерированная ссылка</label>
                  <div className="input-enhanced bg-gray-50 text-gray-600">
                    {formData.link || 'Ссылка будет создана автоматически'}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={generateNewSlug}
                  className="btn-gradient mr-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading-spinner mr-2"></span>
                  ) : null}
                  🔗 Создать ссылку
                </button>
              </div>
            </div>

            {/* Приветственное сообщение */}
            {isBookingCreated && (
              <div className="card-enhanced p-6 animate-fade-in">
                <h4 className="text-lg font-semibold mb-4">Приветственное сообщение для гостя:</h4>
                
                <div className="mb-4">
                  <textarea
                    value={formData.welcome_message}
                    onChange={(e) => setFormData(prev => ({ ...prev, welcome_message: e.target.value }))}
                    className="input-enhanced h-32"
                    placeholder="Сообщение будет сгенерировано автоматически"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={generateWelcomeMessage}
                    className="btn-gradient"
                  >
                    ✨ Сгенерировать сообщение
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => copyToClipboard(formData.welcome_message)}
                    className="btn-coral-gradient"
                    disabled={!formData.welcome_message}
                  >
                    📋 Копировать сообщение
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => sendToWhatsApp(formData.welcome_message)}
                    className="btn-coral-gradient"
                    disabled={!formData.welcome_message || !formData.guest_phone}
                  >
                    📱 Отправить в WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Кнопки навигации */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            className="btn-coral-gradient"
            disabled={currentStep === 1}
          >
            ← Назад
          </button>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="btn-coral-gradient"
            >
              Отмена
            </button>
            
            <button
              type="submit"
              className="btn-gradient"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner mr-2"></span>
              ) : null}
              {currentStep === 3 ? 'Сохранить бронирование' : 'Далее →'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
