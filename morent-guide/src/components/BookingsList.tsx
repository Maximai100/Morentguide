import React, { useState, useEffect } from 'react';
import type { Booking, Apartment } from '../types';
import { bookingApi, apartmentApi } from '../utils/api';

interface BookingsListProps {
  onEdit: (booking: Booking) => void;
  onRefresh?: () => void;
  refreshTrigger?: number;
}

const BookingsList: React.FC<BookingsListProps> = ({ 
  onEdit, 
  onRefresh,
  refreshTrigger = 0 
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Загружаем бронирования и апартаменты параллельно
      const [bookingsData, apartmentsData] = await Promise.all([
        bookingApi.getAll(),
        apartmentApi.getAll()
      ]);
      
      setBookings(bookingsData);
      setApartments(apartmentsData);
    } catch (err) {
      setError('Ошибка загрузки данных');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const handleDelete = async (id: string, guestName: string) => {
    if (!confirm(`Вы уверены, что хотите удалить бронирование для "${guestName}"?`)) {
      return;
    }

    try {
      await bookingApi.delete(id);
      setBookings(prev => prev.filter(booking => booking.id !== id));
      onRefresh?.();
    } catch (err) {
      alert('Ошибка при удалении бронирования');
      console.error('Error deleting booking:', err);
    }
  };

  const handleGenerateNewSlug = async (booking: Booking) => {
    try {
      const slugResponse = await bookingApi.generateSlug();
      const newSlug = slugResponse.slug;
      await bookingApi.update(booking.id, { ...booking, slug: newSlug });
      
      setBookings(prev => prev.map(b => 
        b.id === booking.id ? { ...b, slug: newSlug } : b
      ));
      
      alert('Новая ссылка сгенерирована!');
    } catch (err) {
      alert('Ошибка при генерации новой ссылки');
      console.error('Error generating new slug:', err);
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

  const getApartmentInfo = (apartmentId: string) => {
    return apartments.find(apt => apt.id === apartmentId);
  };

  const getGuestLink = (slug: string) => {
    return `${window.location.origin}/booking/${slug}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  if (loading) {
    return (
      <div className="card p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-morent-navy mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка бронирований...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={loadData}
            className="btn-primary mt-4"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="card p-8">
        <div className="text-center text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Бронирования не найдены</h3>
          <p className="mt-2 text-gray-600">Создайте первое бронирование, чтобы начать работу.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const apartment = getApartmentInfo(booking.apartment_id);
        
        return (
          <div key={booking.id} className="card p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {booking.guest_name}
                  </h3>
                  <span className="px-3 py-1 bg-morent-navy text-white text-sm rounded-full">
                    {apartment?.apartment_number || 'N/A'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="font-medium">Даты:</span> {formatDate(booking.checkin_date)} - {formatDate(booking.checkout_date)}
                    </div>
                    <div>
                      <span className="font-medium">Апартамент:</span> {apartment?.title || 'Не найден'}
                    </div>
                    <div>
                      <span className="font-medium">Адрес:</span> {apartment ? `${apartment.base_address}, корп. ${apartment.building_number}, кв. ${apartment.apartment_number}` : 'N/A'}
                    </div>
                  </div>
                  
                  {booking.slug && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700 mb-1">Ссылка для гостя:</p>
                          <p className="text-sm text-blue-600 break-all">{getGuestLink(booking.slug)}</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => copyToClipboard(getGuestLink(booking.slug))}
                            className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded transition-colors"
                            title="Копировать ссылку"
                          >
                            Копировать
                          </button>
                          <button
                            onClick={() => handleGenerateNewSlug(booking)}
                            className="px-3 py-1 text-xs font-medium text-green-600 bg-green-100 hover:bg-green-200 rounded transition-colors"
                            title="Сгенерировать новую ссылку"
                          >
                            Новая ссылка
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-2 ml-6">
                <button
                  onClick={() => onEdit(booking)}
                  className="px-4 py-2 text-sm font-medium text-morent-navy bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  title="Редактировать"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                <button
                  onClick={() => handleDelete(booking.id, booking.guest_name)}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                  title="Удалить"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookingsList;