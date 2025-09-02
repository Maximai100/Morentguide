import React, { useState, useEffect } from 'react';
import type { Booking } from '../types';
import { bookingApi } from '../utils/api';

// Компонент для dropdown действий с бронированиями
const BookingActionsDropdown: React.FC<{
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopyLink: () => void;
  onGenerateNewSlug: () => void;
}> = ({ isOpen, onToggle, onEdit, onDelete, onCopyLink, onGenerateNewSlug }) => {
  return (
    <div className={`actions-dropdown ${isOpen ? 'open' : ''}`}>
      <button
        onClick={onToggle}
        className="actions-dropdown-button group"
        aria-label="Действия"
      >
        <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="19" cy="12" r="1"></circle>
          <circle cx="5" cy="12" r="1"></circle>
        </svg>
      </button>
      
      <div className="actions-dropdown-menu">
        <button
          onClick={() => {
            onCopyLink();
            onToggle();
          }}
          className="actions-dropdown-item w-full text-left"
        >
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Копировать ссылку
        </button>
        
        <button
          onClick={() => {
            onGenerateNewSlug();
            onToggle();
          }}
          className="actions-dropdown-item w-full text-left"
        >
          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Новая ссылка
        </button>
        
        <hr className="my-1 border-slate-200 dark:border-slate-600" />
        
        <button
          onClick={() => {
            onEdit();
            onToggle();
          }}
          className="actions-dropdown-item w-full text-left"
        >
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Редактировать
        </button>
        
        <button
          onClick={() => {
            onDelete();
            onToggle();
          }}
          className="actions-dropdown-item w-full text-left text-red-600 dark:text-red-400"
        >
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Удалить
        </button>
      </div>
    </div>
  );
};

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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

  // Закрываем dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && !(event.target as Element).closest('.actions-dropdown')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

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
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
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
          className="btn btn-primary"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="card-simple p-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">Нет доступных бронирований. Добавьте новое бронирование, чтобы начать.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="card-enhanced group animate-fade-in">
          <div className="card-body">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-morent-coral to-morent-coral-dark rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {booking.guest_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 group-hover:text-morent-coral dark:group-hover:text-morent-coral transition-colors">
                      {booking.guest_name}
                    </h3>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      <span className="font-medium">Даты:</span> {booking.checkin_date} — {booking.checkout_date}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      <span className="font-medium">Апартамент:</span> {booking.apartment?.title || 'Не указан'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      {booking.slug}
                    </span>
                  </div>
                </div>
              </div>

              <BookingActionsDropdown
                isOpen={openDropdown === booking.id}
                onToggle={() => setOpenDropdown(openDropdown === booking.id ? null : booking.id)}
                onEdit={() => onEdit(booking)}
                onDelete={() => handleDelete(booking.id, booking.guest_name)}
                onCopyLink={() => copyLink(booking)}
                onGenerateNewSlug={() => generateNewSlug(booking)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingsList;