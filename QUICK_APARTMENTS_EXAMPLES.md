# 📝 Примеры заполнения 25 апартаментов

## 🏠 Структура для быстрого заполнения

### Корпус 1 (апартаменты 101-110):
```
Апартамент 1:
- title: "Морской бриз 101"
- apartment_number: "101"
- building_number: "1"
- base_address: "г. Сочи, ул. Морская, 15"
- wifi_name: "Morent_101"
- wifi_password: "welcome101"

Апартамент 2:
- title: "Солнечный вид 102"
- apartment_number: "102"
- building_number: "1"
- base_address: "г. Сочи, ул. Морская, 15"
- wifi_name: "Morent_102"
- wifi_password: "welcome102"
```

### Корпус 2 (апартаменты 201-210):
```
Апартамент 11:
- title: "Панорамный 201"
- apartment_number: "201"
- building_number: "2"
- base_address: "г. Сочи, ул. Морская, 15"
- wifi_name: "Morent_201"
- wifi_password: "welcome201"
```

### Корпус 3 (апартаменты 301-305):
```
Апартамент 21:
- title: "Уютный 301"
- apartment_number: "301"
- building_number: "3"
- base_address: "г. Сочи, ул. Морская, 15"
- wifi_name: "Morent_301"
- wifi_password: "welcome301"
```

## 🔧 Шаблон для быстрого копирования:

```
title: "Название {номер}"
apartment_number: "{номер}"
building_number: "{корпус}"
base_address: "г. Сочи, ул. Морская, 15"
description: "Уютные апартаменты в корпусе {корпус}, номер {номер}"
wifi_name: "Morent_{номер}"
wifi_password: "welcome{номер}"
code_building: "1234"
code_lock: "56{номер}"
manager_name: "Анна Морская"
manager_phone: "+7 (999) 123-45-67"
manager_email: "anna@morent.guide"
faq_checkin: "Заезд с 14:00. Ваш корпус {корпус}, апартамент {номер}"
faq_apartment: "В апартаментах {номер} есть все необходимое"
faq_area: "Прекрасный район у моря"
```

## 💡 Советы по заполнению:

1. **Названия**: делайте уникальными, отражающими особенности каждого апартамента
2. **WiFi**: используйте формат `Morent_{номер}` для легкого запоминания
3. **Коды замков**: можете использовать `56{номер}` для уникальности
4. **FAQ**: персонализируйте с указанием корпуса и номера
5. **Фото**: загружайте для каждого апартамента индивидуально

## ⚡ Быстрое заполнение в Directus:

1. Создайте 1-2 апартамента полностью
2. Используйте функцию **дублирования** в Directus
3. Изменяйте только: title, apartment_number, building_number, wifi_name, wifi_password
4. Оставляйте общие поля (base_address, manager_*) без изменений