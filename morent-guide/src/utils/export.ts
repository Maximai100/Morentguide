// Утилиты для экспорта данных

import type { Booking, Apartment } from '../types';

// Интерфейс для данных экспорта
interface ExportData {
  bookings: Booking[];
  apartments: Apartment[];
}

// Экспорт в CSV
export const exportToCSV = (data: ExportData, filename: string = 'morent-data'): void => {
  const { bookings, apartments } = data;
  
  // Создаем заголовки для CSV
  const headers = [
    'ID',
    'Имя гостя',
    'Дата заезда',
    'Дата выезда',
    'Апартамент',
    'Корпус',
    'Номер',
    'Адрес',
    'Slug',
    'Дата создания'
  ];
  
  // Создаем строки данных
  const rows = bookings.map(booking => {
    const apartment = apartments.find(apt => apt.id === booking.apartment_id);
    return [
      booking.id,
      booking.guest_name,
      booking.checkin_date,
      booking.checkout_date,
      apartment?.title || 'Не указан',
      apartment?.building_number || 'Не указан',
      apartment?.apartment_number || 'Не указан',
      apartment?.base_address || 'Не указан',
      booking.slug,
      booking.created_at || booking.date_created || 'Не указана'
    ];
  });
  
  // Объединяем заголовки и данные
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  // Создаем и скачиваем файл
  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
};

// Экспорт в Excel (XLSX)
export const exportToExcel = async (data: ExportData, filename: string = 'morent-data'): Promise<void> => {
  try {
    // Динамически импортируем библиотеку для работы с Excel
    const XLSX = await import('xlsx');
    
    const { bookings, apartments } = data;
    
    // Подготавливаем данные для Excel
    const excelData = bookings.map(booking => {
      const apartment = apartments.find(apt => apt.id === booking.apartment_id);
      return {
        'ID': booking.id,
        'Имя гостя': booking.guest_name,
        'Дата заезда': booking.checkin_date,
        'Дата выезда': booking.checkout_date,
        'Апартамент': apartment?.title || 'Не указан',
        'Корпус': apartment?.building_number || 'Не указан',
        'Номер': apartment?.apartment_number || 'Не указан',
        'Адрес': apartment?.base_address || 'Не указан',
        'Wi-Fi': apartment?.wifi_name || 'Не указан',
        'Код подъезда': apartment?.code_building || 'Не указан',
        'Код замка': apartment?.code_lock || 'Не указан',
        'Менеджер': apartment?.manager_name || 'Не указан',
        'Телефон': apartment?.manager_phone || 'Не указан',
        'Email': apartment?.manager_email || 'Не указан',
        'Slug': booking.slug,
        'Дата создания': booking.created_at || booking.date_created || 'Не указана'
      };
    });
    
    // Создаем рабочую книгу
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Добавляем лист в книгу
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Бронирования');
    
    // Создаем и скачиваем файл
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    
  } catch (error) {
    console.error('Ошибка экспорта в Excel:', error);
    // Fallback к CSV если Excel недоступен
    exportToCSV(data, filename);
  }
};

// Экспорт в PDF
export const exportToPDF = async (data: ExportData, filename: string = 'morent-data'): Promise<void> => {
  try {
    // Динамически импортируем библиотеку для работы с PDF
    const jsPDF = await import('jspdf');
    const autoTable = await import('jspdf-autotable');
    
    const { bookings, apartments } = data;
    
    // Создаем новый PDF документ
    const doc = new jsPDF.default();
    
    // Добавляем заголовок
    doc.setFontSize(20);
    doc.text('Отчет по бронированиям Morent Guide', 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Дата создания: ${new Date().toLocaleDateString('ru-RU')}`, 14, 30);
    doc.text(`Всего бронирований: ${bookings.length}`, 14, 40);
    
    // Подготавливаем данные для таблицы
    const tableData = bookings.map(booking => {
      const apartment = apartments.find(apt => apt.id === booking.apartment_id);
      return [
        booking.guest_name,
        booking.checkin_date,
        booking.checkout_date,
        apartment?.title || 'Не указан',
        apartment?.manager_name || 'Не указан',
        apartment?.manager_phone || 'Не указан'
      ];
    });
    
    // Добавляем таблицу
    autoTable.default(doc, {
      head: [['Гость', 'Заезд', 'Выезд', 'Апартамент', 'Менеджер', 'Телефон']],
      body: tableData,
      startY: 50,
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [14, 42, 59], // Цвет Morent
        textColor: 255
      }
    });
    
    // Создаем и скачиваем файл
    doc.save(`${filename}.pdf`);
    
  } catch (error) {
    console.error('Ошибка экспорта в PDF:', error);
    // Fallback к CSV если PDF недоступен
    exportToCSV(data, filename);
  }
};

// Экспорт статистики
export const exportStatistics = async (data: ExportData, filename: string = 'morent-statistics'): Promise<void> => {
  const { bookings, apartments } = data;
  
  // Подсчитываем статистику
  const stats = {
    totalBookings: bookings.length,
    totalApartments: apartments.length,
    bookingsByMonth: {} as Record<string, number>,
    popularApartments: {} as Record<string, number>,
    averageStayDuration: 0
  };
  
  // Статистика по месяцам
  bookings.forEach(booking => {
    const month = new Date(booking.checkin_date).toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'long' 
    });
    stats.bookingsByMonth[month] = (stats.bookingsByMonth[month] || 0) + 1;
  });
  
  // Популярные апартаменты
  bookings.forEach(booking => {
    const apartment = apartments.find(apt => apt.id === booking.apartment_id);
    if (apartment) {
      stats.popularApartments[apartment.title] = (stats.popularApartments[apartment.title] || 0) + 1;
    }
  });
  
  // Средняя продолжительность пребывания
  const totalDays = bookings.reduce((sum, booking) => {
    const checkin = new Date(booking.checkin_date);
    const checkout = new Date(booking.checkout_date);
    const days = Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24));
    return sum + days;
  }, 0);
  
  stats.averageStayDuration = totalDays / bookings.length;
  
  // Создаем отчет
  const report = `
Отчет по статистике Morent Guide
Дата создания: ${new Date().toLocaleDateString('ru-RU')}

ОБЩАЯ СТАТИСТИКА:
- Всего бронирований: ${stats.totalBookings}
- Всего апартаментов: ${stats.totalApartments}
- Средняя продолжительность пребывания: ${stats.averageStayDuration.toFixed(1)} дней

БРОНИРОВАНИЯ ПО МЕСЯЦАМ:
${Object.entries(stats.bookingsByMonth)
  .map(([month, count]) => `- ${month}: ${count} бронирований`)
  .join('\n')}

ПОПУЛЯРНЫЕ АПАРТАМЕНТЫ:
${Object.entries(stats.popularApartments)
  .sort(([,a], [,b]) => b - a)
  .map(([apartment, count]) => `- ${apartment}: ${count} бронирований`)
  .join('\n')}
  `;
  
  // Скачиваем отчет
  downloadFile(report, `${filename}.txt`, 'text/plain');
};

// Вспомогательная функция для скачивания файлов
const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// Экспорт конкретного бронирования
export const exportBooking = async (booking: Booking, apartment: Apartment): Promise<void> => {
  const data = {
    guest: booking.guest_name,
    checkin: booking.checkin_date,
    checkout: booking.checkout_date,
    apartment: apartment.title,
    address: apartment.base_address,
    building: apartment.building_number,
    number: apartment.apartment_number,
    wifi: apartment.wifi_name,
    wifiPassword: apartment.wifi_password,
    buildingCode: apartment.code_building,
    lockCode: apartment.code_lock,
    manager: apartment.manager_name,
    phone: apartment.manager_phone,
    email: apartment.manager_email,
    slug: booking.slug
  };
  
  const report = `
ИНФОРМАЦИЯ О БРОНИРОВАНИИ
Гость: ${data.guest}
Даты: ${data.checkin} - ${data.checkout}

АПАРТАМЕНТ:
Название: ${data.apartment}
Адрес: ${data.address}
Корпус: ${data.building}
Номер: ${data.number}

ДОСТУП:
Wi-Fi: ${data.wifi}
Пароль Wi-Fi: ${data.wifiPassword}
Код подъезда: ${data.buildingCode}
Код замка: ${data.lockCode}

КОНТАКТЫ МЕНЕДЖЕРА:
Имя: ${data.manager}
Телефон: ${data.phone}
Email: ${data.email}

Ссылка: ${window.location.origin}/booking/${data.slug}
  `;
  
  downloadFile(report, `booking-${data.guest}-${data.checkin}.txt`, 'text/plain');
};
