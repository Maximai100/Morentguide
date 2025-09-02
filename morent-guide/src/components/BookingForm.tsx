import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import type { Booking, Apartment } from '../types';
import { bookingApi, apartmentApi } from '../utils/api';

interface BookingFormProps {
  booking?: Booking;
  onSave: (booking: Booking) => void;
  onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  booking,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<Booking>>({
    guest_name: '',
    checkin_date: '',
    checkout_date: '',
    apartment_id: '',
    slug: ''
  });

  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadApartments();
    if (booking) {
      setFormData(booking);
    }
  }, [booking]);

  const loadApartments = async () => {
    try {
      const data = await apartmentApi.getAll();
      setApartments(data);
    } catch (error) {
      console.error('Error loading apartments:', error);
    }
  };

  const handleInputChange = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Очищаем ошибку для этого поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const generateSlug = (guestName: string) => {
    if (!guestName.trim()) return '';
    return guestName.toLowerCase()
      .replace(/[^a-zа-яё\s]/g, '')
      .replace(/\s+/g, '.')
      .trim() + '.' + Date.now();
  };

  const handleGuestNameChange = (value: string) => {
    handleInputChange('guest_name', value);
    // Автоматически генерируем slug при изменении имени гостя
    if (value.trim()) {
      const newSlug = generateSlug(value);
      setFormData(prev => ({ ...prev, slug: newSlug }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.guest_name?.trim()) {
      newErrors.guest_name = 'Имя гостя обязательно';
    }

    if (!formData.checkin_date) {
      newErrors.checkin_date = 'Дата заезда обязательна';
    }

    if (!formData.checkout_date) {
      newErrors.checkout_date = 'Дата выезда обязательна';
    }

    if (!formData.apartment_id) {
      newErrors.apartment_id = 'Выберите апартамент';
    }

    // Проверяем, что дата выезда позже даты заезда
    if (formData.checkin_date && formData.checkout_date) {
      const checkin = new Date(formData.checkin_date);
      const checkout = new Date(formData.checkout_date);
      if (checkout <= checkin) {
        newErrors.checkout_date = 'Дата выезда должна быть позже даты заезда';
      }
    }

    // Проверяем, что дата заезда не в прошлом
    if (formData.checkin_date) {
      const checkin = new Date(formData.checkin_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (checkin < today) {
        newErrors.checkin_date = 'Дата заезда не может быть в прошлом';
      }
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
      let savedBooking: Booking;

      if (booking?.id) {
        // Обновление существующего
        savedBooking = await bookingApi.update(booking.id, formData as Booking);
      } else {
        // Создание нового
        savedBooking = await bookingApi.create(formData as Omit<Booking, 'id'>);
      }

      onSave(savedBooking);
    } catch (error) {
      console.error('Error saving booking:', error);
      setErrors({ submit: 'Ошибка при сохранении бронирования' });
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!booking?.id;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">
          {isEditing ? 'Редактировать бронирование' : 'Добавить бронирование'}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          {isEditing ? 'Внесите изменения в информацию о бронировании' : 'Заполните информацию о новом бронировании'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основная информация */}
        <div className="card-simple p-6">
          <h3 className="text-lg font-heading font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Информация о госте
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Имя гостя"
              name="guest_name"
              value={formData.guest_name || ''}
              onChange={handleGuestNameChange}
              placeholder="Имя и фамилия гостя"
              required
              error={errors.guest_name}
            />
            
            <FormField
              label="Ссылка (slug)"
              name="slug"
              value={formData.slug || ''}
              onChange={(value) => handleInputChange('slug', value)}
              placeholder="Автоматически генерируется"
              help="Уникальная ссылка для доступа к информации о бронировании"
            />
          </div>
        </div>

        {/* Даты */}
        <div className="card-simple p-6">
          <h3 className="text-lg font-heading font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Даты пребывания
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Дата заезда"
              name="checkin_date"
              type="date"
              value={formData.checkin_date || ''}
              onChange={(value) => handleInputChange('checkin_date', value)}
              required
              error={errors.checkin_date}
            />
            
            <FormField
              label="Дата выезда"
              name="checkout_date"
              type="date"
              value={formData.checkout_date || ''}
              onChange={(value) => handleInputChange('checkout_date', value)}
              required
              error={errors.checkout_date}
            />
          </div>
        </div>

        {/* Апартамент */}
        <div className="card-simple p-6">
          <h3 className="text-lg font-heading font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Выбор апартамента
          </h3>
          <FormField
            label="Апартамент"
            name="apartment_id"
            type="select"
            value={formData.apartment_id || ''}
            onChange={(value) => handleInputChange('apartment_id', value)}
            required
            error={errors.apartment_id}
            options={apartments.map(apt => ({
              value: apt.id,
              label: `${apt.title} - ${apt.base_address}, корп. ${apt.building_number}, кв. ${apt.apartment_number}`
            }))}
          />
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
              <span>{isEditing ? 'Сохранить изменения' : 'Добавить бронирование'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;