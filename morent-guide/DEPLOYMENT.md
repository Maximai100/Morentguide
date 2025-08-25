# 🚀 Деплой Morent Guide

## Подготовка к деплою

### 1. Переменные окружения

Создайте файл `.env.local` на основе `env.example`:

```bash
cp env.example .env.local
```

Заполните переменные:

```env
# Режим работы приложения
VITE_APP_MODE=production

# Настройки для демо-режима (без HTTP-запросов)
VITE_DEMO_MODE=false

# Настройки Directus API
VITE_DIRECTUS_URL=https://1.cycloscope.online
VITE_DIRECTUS_TOKEN=your_directus_token_here

# Настройки приложения
VITE_APP_TITLE=Morent Guide
VITE_APP_DESCRIPTION=Персональные лендинги для гостей апартаментов Morent

# Настройки для деплоя
VITE_BASE_URL=/
```

### 2. Проверка сборки

```bash
# Установка зависимостей
pnpm install

# Проверка типов
pnpm type-check

# Линтинг
pnpm lint

# Сборка для production
pnpm build:prod
```

### 3. Локальное тестирование

```bash
# Предварительный просмотр production сборки
pnpm preview:prod
```

## Варианты деплоя

### 1. Vercel (Рекомендуется)

1. Подключите репозиторий к Vercel
2. Настройте переменные окружения в Vercel Dashboard
3. Настройте автоматический деплой

**Переменные окружения в Vercel:**
- `VITE_DIRECTUS_URL`
- `VITE_DIRECTUS_TOKEN`
- `VITE_DEMO_MODE=false`

### 2. Netlify

1. Подключите репозиторий к Netlify
2. Настройте build команду: `pnpm build:prod`
3. Настройте publish directory: `dist`
4. Добавьте переменные окружения

### 3. GitHub Pages

```bash
# Деплой на GitHub Pages
pnpm deploy
```

### 4. Docker

Создайте `Dockerfile`:

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Создайте `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass https://1.cycloscope.online;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

## Проверка после деплоя

### 1. Функциональность

- [ ] Админ-панель доступна по `/admin`
- [ ] Создание апартаментов работает
- [ ] Создание бронирований работает
- [ ] Генерация ссылок работает
- [ ] Гостевые страницы отображаются корректно

### 2. Производительность

- [ ] Время загрузки < 3 секунд
- [ ] Размер бандла < 500KB
- [ ] Lighthouse score > 90

### 3. Безопасность

- [ ] HTTPS включен
- [ ] Заголовки безопасности настроены
- [ ] Переменные окружения защищены

## Мониторинг

### Логи

Настройте мониторинг ошибок:
- Sentry для отслеживания ошибок
- Google Analytics для аналитики
- Uptime Robot для мониторинга доступности

### Уведомления

Настройте уведомления о:
- Ошибках в production
- Долгом времени отклика
- Недоступности сервиса

## Резервное копирование

### База данных

Настройте автоматическое резервное копирование Directus:
- Ежедневные бэкапы
- Хранение 30 дней
- Тестирование восстановления

### Файлы

Настройте резервное копирование медиафайлов:
- Автоматическая синхронизация
- Версионирование файлов
- Географическое распределение

## Обновления

### Процесс обновления

1. Создайте feature branch
2. Внесите изменения
3. Протестируйте локально
4. Создайте Pull Request
5. Проведите code review
6. Деплой в staging
7. Тестирование в staging
8. Деплой в production

### Откат

Подготовьте план отката:
- Сохранение предыдущей версии
- Быстрое переключение на старую версию
- Восстановление базы данных

## Поддержка

### Документация

- [README.md](../README.md) - общее описание
- [TECH_PLAN.md](../TECH_PLAN.md) - техническая архитектура
- [ENTITIES.md](../ENTITIES.md) - структура данных

### Контакты

- Техническая поддержка: [email]
- Документация: [ссылка на docs]
- Мониторинг: [ссылка на dashboard]
