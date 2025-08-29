// Система автоматических напоминаний

import type { Booking, Apartment } from '../types';
import { sendCheckinReminder, sendImportantUpdate } from './notifications';

export interface Reminder {
  id: string;
  bookingId: string;
  type: 'checkin' | 'checkout' | 'custom';
  title: string;
  message: string;
  scheduledDate: Date;
  isSent: boolean;
  createdAt: Date;
}

// Проверка и отправка напоминаний
export const checkAndSendReminders = async (bookings: Booking[], apartments: Apartment[]): Promise<void> => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  for (const booking of bookings) {
    const apartment = apartments.find(apt => apt.id === booking.apartment_id);
    if (!apartment) continue;

    const checkinDate = new Date(booking.checkin_date);
    const checkoutDate = new Date(booking.checkout_date);

    // Напоминание за день до заезда
    if (checkinDate.toDateString() === tomorrow.toDateString()) {
      await sendCheckinReminder(
        booking.guest_name,
        booking.checkin_date,
        apartment.title
      );
    }

    // Уведомление в день заезда
    if (checkinDate.toDateString() === today.toDateString()) {
      await sendCheckinReminder(
        booking.guest_name,
        booking.checkin_date,
        apartment.title
      );
    }

    // Напоминание о выезде
    if (checkoutDate.toDateString() === tomorrow.toDateString()) {
      await sendImportantUpdate(
        'Напоминание о выезде',
        `Завтра, ${booking.guest_name}, ваш выезд из ${apartment.title}. Не забудьте проверить все вещи!`
      );
    }
  }
};

// Создание кастомного напоминания
export const createCustomReminder = (
  bookingId: string,
  type: Reminder['type'],
  title: string,
  message: string,
  scheduledDate: Date
): Reminder => {
  return {
    id: `reminder-${Date.now()}`,
    bookingId,
    type,
    title,
    message,
    scheduledDate,
    isSent: false,
    createdAt: new Date()
  };
};

// Проверка кастомных напоминаний
export const checkCustomReminders = async (reminders: Reminder[]): Promise<void> => {
  const now = new Date();

  for (const reminder of reminders) {
    if (!reminder.isSent && reminder.scheduledDate <= now) {
      await sendImportantUpdate(reminder.title, reminder.message);
      reminder.isSent = true;
    }
  }
};

// Создание напоминаний для нового бронирования
export const createBookingReminders = (booking: Booking, apartment: Apartment): Reminder[] => {
  const checkinDate = new Date(booking.checkin_date);
  const checkoutDate = new Date(booking.checkout_date);
  
  const reminders: Reminder[] = [];

  // Напоминание за 3 дня до заезда
  const threeDaysBefore = new Date(checkinDate);
  threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);
  
  reminders.push(createCustomReminder(
    booking.id,
    'checkin',
    'Подготовка к заезду',
    `Через 3 дня, ${booking.guest_name}, ваш заезд в ${apartment.title}. Начните подготовку к поездке!`,
    threeDaysBefore
  ));

  // Напоминание за день до заезда
  const dayBefore = new Date(checkinDate);
  dayBefore.setDate(dayBefore.getDate() - 1);
  
  reminders.push(createCustomReminder(
    booking.id,
    'checkin',
    'Завтра заезд!',
    `Завтра, ${booking.guest_name}, ваш заезд в ${apartment.title}. Все готово к вашему приезду!`,
    dayBefore
  ));

  // Напоминание в день заезда
  reminders.push(createCustomReminder(
    booking.id,
    'checkin',
    'Добро пожаловать!',
    `Сегодня, ${booking.guest_name}, ваш заезд в ${apartment.title}. Желаем приятного отдыха!`,
    checkinDate
  ));

  // Напоминание за день до выезда
  const dayBeforeCheckout = new Date(checkoutDate);
  dayBeforeCheckout.setDate(dayBeforeCheckout.getDate() - 1);
  
  reminders.push(createCustomReminder(
    booking.id,
    'checkout',
    'Напоминание о выезде',
    `Завтра, ${booking.guest_name}, ваш выезд из ${apartment.title}. Не забудьте проверить все вещи!`,
    dayBeforeCheckout
  ));

  return reminders;
};

// Сохранение напоминаний в localStorage
export const saveReminders = (reminders: Reminder[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('morent-reminders', JSON.stringify(reminders));
  }
};

// Загрузка напоминаний из localStorage
export const loadReminders = (): Reminder[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('morent-reminders');
    if (saved) {
      const reminders = JSON.parse(saved);
      return reminders.map((reminder: Reminder) => ({
        ...reminder,
        scheduledDate: new Date(reminder.scheduledDate),
        createdAt: new Date(reminder.createdAt)
      }));
    }
  }
  return [];
};

// Добавление нового напоминания
export const addReminder = (reminder: Reminder): void => {
  const reminders = loadReminders();
  reminders.push(reminder);
  saveReminders(reminders);
};

// Удаление напоминания
export const removeReminder = (reminderId: string): void => {
  const reminders = loadReminders();
  const filtered = reminders.filter(r => r.id !== reminderId);
  saveReminders(filtered);
};

// Очистка старых напоминаний
export const cleanupOldReminders = (): void => {
  const reminders = loadReminders();
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const active = reminders.filter(r => 
    r.createdAt > thirtyDaysAgo || !r.isSent
  );
  
  saveReminders(active);
};

// Инициализация системы напоминаний
export const initializeReminders = async (bookings: Booking[], apartments: Apartment[]): Promise<void> => {
  // Очищаем старые напоминания
  cleanupOldReminders();
  
  // Проверяем и отправляем напоминания
  await checkAndSendReminders(bookings, apartments);
  
  // Проверяем кастомные напоминания
  const customReminders = loadReminders();
  await checkCustomReminders(customReminders);
  
  // Сохраняем обновленные напоминания
  saveReminders(customReminders);
};

// Планировщик напоминаний (запускается каждые 30 минут)
export const startReminderScheduler = (bookings: Booking[], apartments: Apartment[]): (() => void) => {
  const interval = setInterval(async () => {
    await initializeReminders(bookings, apartments);
  }, 30 * 60 * 1000); // 30 минут

  // Возвращаем функцию для остановки планировщика
  return () => clearInterval(interval);
};
