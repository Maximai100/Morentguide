import React, { useState, useEffect } from 'react';
import type { Booking, Apartment } from '../types';
import { bookingApi } from '../utils/api';
import { formatDate } from '../utils/helpers';

interface BookingCalendarProps {
  onBookingSelect?: (booking: Booking) => void;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  bookings: Booking[];
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ onBookingSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bookingsData, apartmentsData] = await Promise.all([
        bookingApi.getAll(),
        bookingApi.getAll().then(() => []) // Заглушка для apartments
      ]);
      setBookings(bookingsData);
      setApartments(apartmentsData);
    } catch (error) {
      console.error('Ошибка загрузки данных календаря:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);
      const dayBookings = bookings.filter(booking => {
        const checkin = new Date(booking.checkin_date);
        const checkout = new Date(booking.checkout_date);
        return date >= checkin && date <= checkout;
      });
      
      days.push({
        date: new Date(date),
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
        bookings: dayBookings
      });
    }
    
    return days;
  };

  const getMonthName = (date: Date): string => {
    return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  };



  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    if (day.bookings.length > 0 && onBookingSelect) {
      onBookingSelect(day.bookings[0]);
    }
  };

  const previousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const nextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e2a3b]"></div>
      </div>
    );
  }

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Заголовок календаря */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-gray-900 dark:text-white">
          Календарь бронирований
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={previousMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            ←
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-[#0e2a3b] text-white rounded-lg hover:bg-[#0a1f2b] transition-colors"
          >
            Сегодня
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Название месяца */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {getMonthName(currentDate)}
        </h3>
      </div>

      {/* Дни недели */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Календарная сетка */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            onClick={() => handleDateClick(day)}
            className={`
              min-h-[80px] p-2 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer transition-colors
              ${day.isCurrentMonth 
                ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700' 
                : 'bg-gray-50 dark:bg-gray-900 text-gray-400'
              }
              ${day.isToday ? 'ring-2 ring-[#0e2a3b]' : ''}
              ${selectedDate?.toDateString() === day.date.toDateString() 
                ? 'bg-[#0e2a3b] text-white' 
                : ''
              }
            `}
          >
            <div className="text-sm font-medium mb-1">
              {day.date.getDate()}
            </div>
            
            {/* Бронирования */}
            <div className="space-y-1">
              {day.bookings.slice(0, 2).map((booking, idx) => (
                <div
                  key={idx}
                  className={`
                    text-xs p-1 rounded truncate
                    ${selectedDate?.toDateString() === day.date.toDateString()
                      ? 'bg-white text-[#0e2a3b]'
                      : 'bg-[#0e2a3b] text-white'
                    }
                  `}
                  title={`${booking.guest_name} - ${formatDate(booking.checkin_date)}`}
                >
                  {booking.guest_name}
                </div>
              ))}
              {day.bookings.length > 2 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  +{day.bookings.length - 2} еще
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Легенда */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#0e2a3b] rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Бронирование</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 border-2 border-[#0e2a3b] rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Сегодня</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
