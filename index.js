const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Импорт маршрутов
const authRouter = require('./src/routes/authRoutes');
const eventsRouter = require('./src/routes/eventsRoutes');
const profileRouter = require('./src/routes/profileRoutes');
const helpRouter = require('./src/routes/helpRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Настройка Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      fontSrc: ["'self'", 'https://fonts.googleapis.com'],
      styleSrc: ["'self'", 'https://fonts.googleapis.com'],
      // Добавьте другие директивы, если нужно
    }
  }
}));

// Настройка CORS
app.use(cors({
  origin: 'http://localhost:3000'  // Разрешаем только этот источник
}));

// Настройки Express
app.use(express.json());

// Подключение маршрутов
app.use('/auth', authRouter);
app.use('/events', eventsRouter);
app.use('/profile', profileRouter);
app.use('/help', helpRouter);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
