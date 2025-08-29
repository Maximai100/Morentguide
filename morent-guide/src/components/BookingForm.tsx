import React, { useState, useEffect } from 'react';
import type { Booking, Apartment } from '../types';
import { apartmentApi } from '../utils/api';
import FormField from './FormField';

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

  const [formData, setFormData] = useState<Omit<Booking, 'id'>>({
    guest_name: booking?.guest_name || '',
    checkin_date: booking?.checkin_date || '',
    checkout_date: booking?.checkout_date || '',
    apartment_id: booking?.apartment_id || '',
    slug: booking?.slug || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadApartments();
  }, []);



  const loadApartments = async () => {
    try {
      const data = await apartmentApi.getAll();
      setApartments(data);
    } catch (err) {
      console.error('Error loading apartments:', err);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.guest_name) {
      newErrors.guest_name = 'Имя гостя обязательно.';
    }
    if (!formData.apartment_id) {
      newErrors.apartment_id = 'Апартамент обязателен.';
    }
    if (!formData.checkin_date) {
      newErrors.checkin_date = 'Дата заезда обязательна.';
    }
    if (!formData.checkout_date) {
      newErrors.checkout_date = 'Дата выезда обязательна.';
    }

    // Date validation
    if (formData.checkin_date && formData.checkout_date) {
      const checkin = new Date(formData.checkin_date);
      const checkout = new Date(formData.checkout_date);
      if (checkin >= checkout) {
        newErrors.checkout_date = 'Дата выезда должна быть позже даты заезда.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }
    
    try {
      const dataToSave = booking 
        ? { ...formData, id: booking.id }
        : formData;
      
      await onSave(dataToSave);
    } catch (error) {
      console.error('Error saving booking:', error);
      alert('Ошибка при сохранении бронирования');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => { // Clear error for this field
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const generateNewLink = () => {
    const slug = `${formData.guest_name.toLowerCase().replace(/\s+/g, '.')}.${Date.now()}`;
    setFormData(prev => ({ ...prev, slug }));

  };

  const copyLink = () => {
    const origin = window.location.origin;
    const base = import.meta.env.BASE_URL || '/';
    const baseNormalized = base.endsWith('/') ? base.slice(0, -1) : base;
    const fullLink = `${origin}${baseNormalized}/booking/${encodeURIComponent(formData.slug)}`;
    navigator.clipboard.writeText(fullLink);
    alert('Ссылка скопирована!');
  };

  return (
    <div className="card-simple p-6">
      <h3 className="text-xl font-heading font-semibold mb-6">
        {booking ? 'Редактировать бронирование' : 'Создать новое бронирование'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Имя гостя"
          name="guest_name"
          type="text"
          value={formData.guest_name}
          onChange={handleInputChange}
          required
          error={errors.guest_name}
        />

        <FormField
          label="Апартамент"
          name="apartment_id"
          type="select"
          value={formData.apartment_id}
          onChange={handleInputChange}
          required
          options={apartments.map(apt => ({
            value: apt.id,
            label: `${apt.title} - Корп. ${apt.building_number}, Кв. ${apt.apartment_number}`
          }))}
          error={errors.apartment_id}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Дата заезда"
            name="checkin_date"
            type="date"
            value={formData.checkin_date}
            onChange={handleInputChange}
            required
            error={errors.checkin_date}
          />

          <FormField
            label="Дата выезда"
            name="checkout_date"
            type="date"
            value={formData.checkout_date}
            onChange={handleInputChange}
            required
            error={errors.checkout_date}
          />
        </div>

        {/* Ссылка для гостя */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-heading font-medium text-gray-700 mb-2">Ссылка для гостя</h4>
          
          {!formData.slug ? (
            <button
              type="button"
              onClick={generateNewLink}
              className="btn-secondary btn-mobile"
            >
              Создать бронирование и сгенерировать ссылку
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/booking/${formData.slug}`}
                  className="input-link flex-1"
                />
                <button
                  type="button"
                  onClick={copyLink}
                  className="btn-secondary btn-mobile"
                >
                  Копировать
                </button>
              </div>
              
              {!booking && (
                <p className="text-sm text-green-600">
                  ✓ Ссылка создана! Сначала создайте бронирование
                </p>
              )}
            </div>
          )}
        </div>

        {/* Кнопки */}
        <div className="flex justify-end space-x-4 pt-4">
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
            disabled={isLoading || (!booking && !formData.slug)}
          >
            {isLoading ? 'Сохранение...' : (booking ? 'Сохранить' : 'Создать')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;