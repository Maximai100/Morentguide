import React, { useState, useEffect } from 'react';
import type { Booking, Apartment } from '../types';
import { apartmentApi } from '../utils/api';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Имя гостя
          </label>
          <input
            type="text"
            name="guest_name"
            value={formData.guest_name}
            onChange={handleInputChange}
            className="input-simple"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Апартамент
          </label>
          <select
            name="apartment_id"
            value={formData.apartment_id}
            onChange={handleInputChange}
            className="input-simple"
            required
          >
            <option value="">Выберите апартамент</option>
            {apartments.map(apt => (
              <option key={apt.id} value={apt.id}>
                {apt.title} - Корп. {apt.building_number}, Кв. {apt.apartment_number}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дата заезда
            </label>
            <input
              type="date"
              name="checkin_date"
              value={formData.checkin_date}
              onChange={handleInputChange}
              className="input-simple"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дата выезда
            </label>
            <input
              type="date"
              name="checkout_date"
              value={formData.checkout_date}
              onChange={handleInputChange}
              className="input-simple"
              required
            />
          </div>
        </div>

        {/* Ссылка для гостя */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-heading font-medium text-gray-700 mb-2">Ссылка для гостя</h4>
          
          {!formData.slug ? (
            <button
              type="button"
              onClick={generateNewLink}
              className="btn-secondary"
            >
              Создать бронирование и сгенерировать ссылку
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/booking/${formData.slug}`}
                  className="input-simple flex-1"
                />
                <button
                  type="button"
                  onClick={copyLink}
                  className="btn-secondary"
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