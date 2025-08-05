<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 animate-fade-in">
{/* Skeleton Loading */}
<div className="container mx-auto px-4 py-8">
  <div className="max-w-4xl mx-auto">
    <div className="skeleton-title w-64 h-12 mb-8"></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="skeleton-card h-96 mb-8"></div>
        <div className="skeleton-card h-64 mb-8"></div>
        <div className="skeleton-card h-80"></div>
      </div>
      <div>
        <div className="skeleton-card h-48 mb-6"></div>
        <div className="skeleton-card h-32 mb-6"></div>
        <div className="skeleton-card h-64"></div>
      </div>
    </div>
  </div>
</div>
</div>
);
}

if (error) {
return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
<div className="card-enhanced p-8 text-center animate-fade-in">
  <h2 className="text-2xl font-bold mb-4 text-red-600">Ошибка</h2>
  <p className="text-lg">{error}</p>
</div>
</div>
);
}

if (!booking) return null;

return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 animate-fade-in">
{/* Навигация */}
<nav className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md py-4 mb-8">
<div className="container mx-auto flex justify-center gap-6">
  <button
    className={`tab-enhanced px-4 py-2 rounded-lg font-medium transition ${
      activeSection === 'overview' ? 'bg-gradient-morent text-white' : ''
    }`}
    onClick={() => scrollToSection('overview')}
  >
    Инструкция
  </button>
  <button
    className={`tab-enhanced px-4 py-2 rounded-lg font-medium transition ${
      activeSection === 'gallery' ? 'bg-gradient-morent text-white' : ''
    }`}
    onClick={() => scrollToSection('gallery')}
  >
    Галерея
  </button>
  <button
    className={`tab-enhanced px-4 py-2 rounded-lg font-medium transition ${
      activeSection === 'faq' ? 'bg-gradient-morent text-white' : ''
    }`}
    onClick={() => scrollToSection('faq')}
  >
    FAQ
  </button>
  <button
    className={`tab-enhanced px-4 py-2 rounded-lg font-medium transition ${
      activeSection === 'contacts' ? 'bg-gradient-morent text-white' : ''
    }`}
    onClick={() => scrollToSection('contacts')}
  >
    Контакты
  </button>
</div>
</nav>

<div className="container mx-auto px-4 py-8 max-w-4xl">
{/* Hero / Инструкция */}
<section id="overview" className="mb-12 animate-fade-in">
  <div className="card-enhanced p-8 mb-6">
    <h1 className="text-3xl font-bold mb-4">Добро пожаловать, {booking.guest_name}!</h1>
    <p className="text-lg mb-2">
      Ваши апартаменты: <span className="font-semibold">{booking.apartment_title}</span>
    </p>
    <p className="mb-2">
      Даты проживания: <b>{booking.date_start}</b> — <b>{booking.date_end}</b>
    </p>
    <div className="mt-4">
      <div className="glass-dark p-4 rounded-xl mb-2">
        <span className="font-semibold">Код доступа:</span>
        <span className="ml-2 text-xl tracking-widest">{booking.lock_code}</span>
      </div>
      <div className="glass-dark p-4 rounded-xl">
        <span className="font-semibold">WiFi:</span>
        <span className="ml-2">{booking.wifi_name || '—'}</span>
        <span className="ml-4 font-semibold">Пароль:</span>
        <span className="ml-2">{booking.wifi_password || '—'}</span>
      </div>
    </div>
  </div>
  <div className="notification-info mb-6">
    <b>Внимание:</b> Время заезда и подробная инструкция будут отправлены менеджером.
  </div>
</section>

{/* Галерея */}
<section id="gallery" className="mb-12 animate-fade-in">
  <div className="card-enhanced p-6">
    <h2 className="text-2xl font-bold mb-4">Галерея апартаментов</h2>
    {/* Здесь можно реализовать интерактивную галерею, если есть фото */}
    <div className="flex flex-wrap gap-4">
      {/* Пример фото */}
      <div className="w-40 h-32 bg-gray-200 rounded-xl skeleton"></div>
      <div className="w-40 h-32 bg-gray-200 rounded-xl skeleton"></div>
      <div className="w-40 h-32 bg-gray-200 rounded-xl skeleton"></div>
    </div>
    <div className="text-gray-500 mt-2">Фото будут доступны в ближайшее время.</div>
  </div>
</section>

{/* FAQ */}
<section id="faq" className="mb-12 animate-fade-in">
  <div className="card-enhanced p-6">
    <h2 className="text-2xl font-bold mb-4">Частые вопросы</h2>
    <ul className="list-disc pl-6 space-y-2">
      <li>Во сколько заезд и выезд?</li>
      <li>Как пользоваться электронным замком?</li>
      <li>Где найти ближайший магазин?</li>
      <li>Куда обращаться по вопросам?</li>
    </ul>
    <div className="text-gray-500 mt-2">Если у вас остались вопросы — свяжитесь с менеджером!</div>
  </div>
</section>

{/* Контакты */}
<section id="contacts" className="mb-12 animate-fade-in">
  <div className="card-enhanced p-6">
    <h2 className="text-2xl font-bold mb-4">Контакты менеджера</h2>
    <div className="flex flex-col gap-2">
      <span>
        <b>Телефон:</b> <a href={`tel:${booking.manager_phone}`} className="text-blue-600 underline">{booking.manager_phone}</a>
      </span>
      <span>
        <b>WhatsApp:</b> <a href={`https://wa.me/${booking.manager_phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">Написать</a>
      </span>
      <span>
        <b>Email:</b> <a href={`mailto:${booking.manager_email}`} className="text-indigo-600 underline">{booking.manager_email}</a>
      </span>
    </div>
  </div>
</section>
</div>
</div>
);
};

export default BookingPage;