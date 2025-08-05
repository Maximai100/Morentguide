import React, { useState, useEffect } from 'react';
import type { Booking } from '../types';
import { bookingApi } from '../utils/api';

interface BookingsListProps {
  onEdit: (booking: Booking) => void;
  onRefresh?: () => void;
  refreshTrigger?: number;
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

const BookingSkeleton: React.FC = () => (
  <div className="card-enhanced p-6 animate-fade-in flex flex-col md:flex-row md:items-center md:justify-between">
    <div className="flex-1 space-y-2">
      <div className="skeleton-title w-40"></div>
      <div className="skeleton-text w-32"></div>
      <div className="skeleton-text w-24"></div>
    </div>
    <div className="flex space-x-2 mt-4 md:mt-0">
      <div className="skeleton-button w-20"></div>
      <div className="skeleton-button w-20"></div>
    </div>
  </div>
);

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
      setError('Ошибка загрузки бронирований');
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [refreshTrigger]);

  // Статистика
  const stats = {
    total: bookings.length,
    active: bookings.filter(b => b.status === 'active').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-scale-in">
          <div className="glass-effect rounded-xl p-6">
            <div className="skeleton-title w-24 mb-2"></div>
            <div className="skeleton-text w-16"></div>
          </div>
          <div className="glass-effect rounded-xl p-6">
            <div className="skeleton-title w-32 mb-2"></div>
            <div className="skeleton-text w-20"></div>
          </div>
          <div className="glass-effect rounded-xl p-6">
            <div className="skeleton-title w-28 mb-2"></div>
            <div className="skeleton-text w-18"></div>
          </div>
        </div>
        {[...Array(3)].map((_, i) => (
          <BookingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-enhanced p-6 animate-fade-in">
        <div className="text-center">
          <div className="notification-error mb-4">
            <p>{error}</p>
          </div>
          <button
            onClick={loadBookings}
            className="btn-coral-gradient"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="card-enhanced p-8 animate-fade-in">
        <div className="text-center text-gray-500">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Бронирования не найдены</h3>
          <p className="text-gray-600 mb-6">Добавьте первое бронирование, чтобы начать работу.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-scale-in">
        <div className="glass-effect rounded-xl p-6">
          <p className="text-sm font-medium text-blue-600">Всего бронирований</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <p className="text-sm font-medium text-green-600">Активные</p>
          <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <p className="text-sm font-medium text-red-600">Отменённые</p>
          <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
        </div>
      </div>

      {/* Список бронирований */}
      <div className="space-y-4">
        {bookings.map((booking, index) => (
          <div
            key={booking.id}
            className="card-enhanced p-6 animate-scale-in flex flex-col md:flex-row md:items-center md:justify-between"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {booking.guest_name}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status] || 'bg-gray-200 text-gray-600'}`}>
                  {booking.status === 'active' && 'Активно'}
                  {booking.status === 'completed' && 'Завершено'}
                  {booking.status === 'cancelled' && 'Отменено'}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  <span className="font-medium">Даты:</span> {booking.date_start} — {booking.date_end}
                </p>
                <p>
                  <span className="font-medium">Апартамент:</span> {booking.apartment_title}
                </p>
                <p>
                  <span className="font-medium">Телефон гостя:</span> {booking.guest_phone}
                </p>
              </div>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button
                onClick={() => onEdit(booking)}
                className="btn-gradient px-4 py-2 text-sm font-medium"
                title="Редактировать"
              >
                ✏️
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(booking.link)}
                className="btn-coral-gradient px-4 py-2 text-sm font-medium"
                title="Скопировать ссылку"
              >
                🔗 Копировать
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsList;
