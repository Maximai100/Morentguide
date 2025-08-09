import React, { useState, useEffect } from 'react';
import type { Booking } from '../types';
import { bookingApi } from '../utils/api';

interface BookingsListProps {
  onEdit: (booking: Booking) => void;
  onRefresh?: () => void;
  refreshTrigger?: number;
}

const BookingsList: React.FC<BookingsListProps> = ({
  onEdit,
  onRefresh,
  refreshTrigger = 0,
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingApi.getAll();
      setBookings(data);
    } catch (err) {
      setError('Ошибка загрузки данных');
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [refreshTrigger]);

  const handleDelete = async (id: string, guestName: string) => {
    if (!confirm(`Вы уверены, что хотите удалить бронирование для "${guestName}"?`)) {
      return;
    }

    try {
      await bookingApi.delete(id);
      setBookings(prev => prev.filter(b => b.id !== id));
      onRefresh?.();
    } catch (err) {
      alert('Ошибка при удалении бронирования');
      console.error('Error deleting booking:', err);
    }
  };

  const copyLink = (booking: Booking) => {
    const origin = window.location.origin;
    const base = import.meta.env.BASE_URL || '/';
    const baseNormalized = base.endsWith('/') ? base.slice(0, -1) : base;
    const fullLink = `${origin}${baseNormalized}/booking/${encodeURIComponent(booking.slug)}`;
    navigator.clipboard.writeText(fullLink);
    alert('Ссылка скопирована!');
  };

  const generateNewSlug = async (booking: Booking) => {
    try {
      const newSlug = `${booking.guest_name.toLowerCase().replace(/\s+/g, '.')}.${Date.now()}`;
      const updatedBooking = { ...booking, slug: newSlug };
      await bookingApi.update(updatedBooking.id, updatedBooking);
      setBookings(prev => prev.map(b => b.id === booking.id ? updatedBooking : b));
      copyLink(updatedBooking);
    } catch (err) {
      alert('Ошибка при генерации новой ссылки');
      console.error('Error generating new slug:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Загрузка бронирований...
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-simple p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadBookings}
          className="btn-primary"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="card-simple p-8 text-center">
        <p className="text-gray-500">Ошибка загрузки данных</p>
        <button
          onClick={loadBookings}
          className="btn-primary mt-4"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="card-simple p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-2">
                {booking.guest_name}
              </h3>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Даты:</strong> {booking.checkin_date} — {booking.checkout_date}</p>
                <p><strong>Апартамент:</strong> {booking.apartment?.title || 'Не указан'}</p>
                <p><strong>Ссылка:</strong> {booking.slug}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 ml-4">
              <button
                onClick={() => copyLink(booking)}
                className="btn-secondary text-sm"
              >
                Копировать ссылку
              </button>
              
              <button
                onClick={() => generateNewSlug(booking)}
                className="btn-secondary text-sm"
              >
                Новая ссылка
              </button>
              
              <button
                onClick={() => onEdit(booking)}
                className="btn-secondary text-sm"
              >
                Редактировать
              </button>
              
              <button
                onClick={() => handleDelete(booking.id, booking.guest_name)}
                className="btn-danger text-sm"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingsList;