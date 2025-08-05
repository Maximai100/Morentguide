import React, { useState, useEffect } from 'react';
import type { Booking, Apartment } from '../types';
import { apartmentApi, bookingApi } from '../utils/api';
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
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [customLockCode, setCustomLockCode] = useState<string>('');
  const [formData, setFormData] = useState<Omit<Booking, 'id'>>({
    guest_name: booking?.guest_name || '',
    checkin_date: booking?.checkin_date || '',
    checkout_date: booking?.checkout_date || '',
    apartment_id: booking?.apartment_id || '',
    slug: booking?.slug || generateSlug()
  });
  const [isBookingCreated, setIsBookingCreated] = useState<boolean>(!!booking);

  // Загружаем список апартаментов
  useEffect(() => {
    const loadApartments = async () => {
      try {
        const data = await apartmentApi.getAll();
        setApartments(data);
        
        // Если редактируем бронирование, находим связанный апартамент
        if (booking?.apartment_id) {
          const apartment = data.find(apt => apt.id === booking.apartment_id);
          setSelectedApartment(apartment || null);
        }
      } catch (error) {
        console.error('Error loading apartments:', error);
      }
    };

    loadApartments();
  }, [booking?.apartment_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Saving booking data:', formData);
    console.log('Is booking created:', isBookingCreated);
    
    // Если бронирование уже создано при генерации slug, обновляем его
    if (isBookingCreated && !booking) {
      // Найдем созданное бронирование по slug и обновим его
      try {
        const bookings = await bookingApi.getAll();
        const existingBooking = bookings.find(b => b.slug === formData.slug);
        if (existingBooking) {
          await bookingApi.update(existingBooking.id, formData);
          alert('Бронирование обновлено!');
        }
      } catch (error) {
        console.error('Error updating booking:', error);
        alert('Ошибка при обновлении бронирования');
      }
    } else {
      // Обычное сохранение
      const dataToSave = booking 
        ? { ...formData, id: booking.id }
        : formData;
      
      await onSave(dataToSave);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Если изменился апартамент, обновляем выбранный апартамент
    if (name === 'apartment_id') {
      const apartment = apartments.find(apt => apt.id === value);
      setSelectedApartment(apartment || null);
    }
  };

  const generateNewSlug = async () => {
    try {
      // Проверяем, есть ли минимальные данные для создания бронирования
      if (!formData.guest_name || !formData.apartment_id || !formData.checkin_date || !formData.checkout_date) {
        alert('Заполните все обязательные поля перед генерацией ссылки');
        return;
      }

      const newSlug = generateSlug();
      setFormData(prev => ({ ...prev, slug: newSlug }));

      // Если это новое бронирование, создаем его в базе данных
      if (!booking) {
        try {
          console.log('Creating booking with slug:', newSlug);
                     const createdBooking = await bookingApi.create({
             guest_name: formData.guest_name,
             apartment_id: formData.apartment_id,
             checkin_date: formData.checkin_date,
             checkout_date: formData.checkout_date,
             slug: newSlug
           });
           console.log('Booking created successfully:', createdBooking);
           setIsBookingCreated(true);
           alert('Бронирование создано! Ссылка теперь активна.');
        } catch (error) {
          console.error('Error creating booking:', error);
          alert('Ошибка при создании бронирования. Попробуйте еще раз.');
        }
      } else {
        // Если редактируем существующее, обновляем slug
        try {
          await bookingApi.update(booking.id, { slug: newSlug });
          alert('Ссылка обновлена!');
        } catch (error) {
          console.error('Error updating slug:', error);
          alert('Ошибка при обновлении ссылки.');
        }
      }
    } catch (error) {
      console.error('Error generating slug:', error);
      alert('Ошибка при генерации ссылки');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Ссылка скопирована в буфер обмена');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      alert('Ошибка при копировании ссылки');
    }
  };

  const getGuestLink = () => {
    if (!formData.slug) return '';
    return `${window.location.origin}/morent-guide/booking/${formData.slug}`;
  };

  const generateWelcomeMessage = () => {
    if (!formData.guest_name || !formData.slug) return '';
    
    const guestLink = getGuestLink();
    const lockCode = customLockCode || selectedApartment?.code_lock || 'не указан';
    
    return `Здравствуйте, ${formData.guest_name} !

Добро пожаловать в MORENT 🌴

Ваша персональная инструкция по заселению: ${guestLink}

Код замка: ${lockCode}

С уважением,
Команда MORENT`;
  };

  const copyMessage = async () => {
    const message = generateWelcomeMessage();
    if (message) {
      await copyToClipboard(message);
    }
  };

  const sendWhatsApp = () => {
    const message = generateWelcomeMessage();
    if (message) {
      const encodedMessage = encodeURIComponent(message);
      const phone = selectedApartment?.manager_phone?.replace(/\D/g, '') || '';
      const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="card p-6 max-w-4xl mx-auto">
      <h3 className="text-xl font-heading font-semibold mb-6">
        {booking ? 'Редактировать бронирование' : 'Создать новое бронирование'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основная информация */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Имя гостя
            </label>
            <input
              type="text"
              name="guest_name"
              value={formData.guest_name}
              onChange={handleInputChange}
              className="input-morent"
              placeholder="Иван Иванов"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Апартамент
            </label>
            <select
              name="apartment_id"
              value={formData.apartment_id}
              onChange={handleInputChange}
              className="input-morent"
              required
            >
              <option value="">Выберите апартамент</option>
              {apartments.map((apartment) => (
                <option key={apartment.id} value={apartment.id}>
                  {apartment.title} (кв. {apartment.apartment_number})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дата заезда
            </label>
            <input
              type="date"
              name="checkin_date"
              value={formData.checkin_date}
              onChange={handleInputChange}
              className="input-morent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дата выезда
            </label>
            <input
              type="date"
              name="checkout_date"
              value={formData.checkout_date}
              onChange={handleInputChange}
              className="input-morent"
              required
            />
          </div>
        </div>

        {/* Информация о выбранном апартаменте */}
        {selectedApartment && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Информация об апартаменте</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Название:</span> {selectedApartment.title}
              </div>
              <div>
                <span className="font-medium">Адрес:</span> {selectedApartment.base_address}, корп. {selectedApartment.building_number}, кв. {selectedApartment.apartment_number}
              </div>
              <div>
                <span className="font-medium">Wi-Fi:</span> {selectedApartment.wifi_name}
              </div>
              <div>
                <span className="font-medium">Код подъезда:</span> {selectedApartment.code_building}
              </div>
              <div>
                <span className="font-medium">Код замка:</span> {selectedApartment.code_lock}
              </div>
              <div>
                <span className="font-medium">Менеджер:</span> {selectedApartment.manager_name}
              </div>
            </div>
            
            {/* Поле для изменения кода замка */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Изменить код замка (опционально)
              </label>
              <input
                type="text"
                value={customLockCode}
                onChange={(e) => setCustomLockCode(e.target.value)}
                className="input-morent"
                placeholder="Введите новый код замка"
              />
              <p className="text-xs text-gray-500 mt-1">
                Если оставить пустым, будет использован код из апартамента
              </p>
            </div>
          </div>
        )}

        {/* Ссылка для гостя */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Ссылка для гостя</h4>
                         <button
               type="button"
               onClick={generateNewSlug}
               className="btn-secondary text-sm"
               disabled={isLoading}
             >
               {isBookingCreated ? 'Сгенерировать новую ссылку' : 'Создать бронирование и сгенерировать ссылку'}
             </button>
          </div>

                     {formData.slug && (
             <div className="bg-blue-50 p-4 rounded-lg">
               <div className="flex items-center justify-between">
                 <div className="flex-1">
                   <p className="text-sm font-medium text-gray-700 mb-1">Ссылка для гостя:</p>
                   <p className="text-sm text-blue-600 break-all">{getGuestLink()}</p>
                   {isBookingCreated && (
                     <p className="text-xs text-green-600 mt-1">✅ Бронирование создано в базе данных</p>
                   )}
                 </div>
                 <button
                   type="button"
                   onClick={() => copyToClipboard(getGuestLink())}
                   className="btn-primary ml-4 text-sm"
                   disabled={!isBookingCreated}
                 >
                   {isBookingCreated ? 'Копировать' : 'Сначала создайте бронирование'}
                 </button>
               </div>
             </div>
           )}
        </div>

        {/* Сообщение для гостя */}
        {formData.guest_name && formData.slug && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Сообщение для гостя</h4>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Предварительный просмотр:</p>
                <div className="bg-white p-3 rounded border text-sm whitespace-pre-line">
                  {generateWelcomeMessage()}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={copyMessage}
                  className="btn-primary text-sm"
                  disabled={isLoading}
                >
                  📋 Копировать сообщение
                </button>
                
                <button
                  type="button"
                  onClick={sendWhatsApp}
                  className="btn-secondary text-sm"
                  disabled={isLoading}
                >
                  📱 Отправить в WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}

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
             {isLoading ? 'Сохранение...' : (booking ? 'Обновить' : (isBookingCreated ? 'Обновить' : 'Создать'))}
           </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;