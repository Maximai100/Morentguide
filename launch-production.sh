#!/bin/bash

echo "🚀 Запуск Morent Guide в продакшн режиме..."

# Установка зависимостей
echo "📦 Установка зависимостей..."
pnpm install

# Сборка проекта
echo "🔨 Сборка проекта..."
pnpm build

# Запуск preview сервера
echo "✅ Запуск продакшн сервера на http://localhost:4173"
pnpm preview