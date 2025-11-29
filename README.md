# WorkBase Platform

**WorkBase Platform** – это современная полнофункциональная веб-платформа для управления пользователями, ролями, профессиями и качествами. Проект реализован по принципам чистой архитектуры и включает в себя полноценный клиент на **React + Redux Toolkit** и backend-сервис на **Node.js / Express + MongoDB**.

🔗 **Live Demo:** https://workbaseplatform.onrender.com/  
🛠 **Стек:** React, Redux Toolkit, Vite, Node.js, Express, MongoDB, Mongoose, Docker

---

## 🚀 Возможности проекта

### 🖥 Клиентская часть (React)

- Авторизация и регистрация пользователей
- Генерация стабильных аватаров (DiceBear)
- Управление списком пользователей
- Просмотр и редактирование профиля
- Управление профессиями и качествами
- Глобальный AppLoader + LoadingProvider
- Защищённые маршруты, токены, localStorageService
- Чистая архитектура: `services/`, `store/`, `hooks/`, `utils/`

### 🧩 Серверная часть (Node.js)

- Express API с модульной структурой
- Авторизация (JWT access + refresh)
- Мидлвары: auth, errorHandler, validate
- Services: token, users, professions, qualities
- Стартовая инициализация базы (`startUp/initDatabase.js`)
- Раздельные роуты `auth`, `users`, `qualities`, `professions`
- Централизованная обработка ошибок

### 🛢 База данных (MongoDB)

- Пользователи
- Профессии
- Качества
- Токены
- Зашитые схемы + валидаторы
- ID-референсы + populate

### 🐳 Docker

- Dockerfile для сервера
- Возможность полноценного деплоя на VDS (Selectel, DigitalOcean, etc.)

---

## 📦 Структура проекта по FSD(Feature slice design)

WorkBase Project/
│
├── client/ # React + Redux Toolkit
│ ├── components/
│ ├── hooks/
│ ├── layout/
│ ├── pages/
│ ├── services/
│ ├── store/
│ ├── utils/
│ └── AppLoader.jsx
│
├── server/ # Node.js + Express + MongoDB
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── services/
│ ├── startUp/
│ └── utils/
│
├── Dockerfile
├── package.json
└── README.md

---

## 🌐 Деплой

Проект развернут на Render:  
👉 https://workbaseplatform.onrender.com/

---

## 🧑‍💻 Автор

Разработчик: **Dilmurad Masharipov**  
Full-Stack / Front-End Developer

---

## 📄 Лицензия

MIT
