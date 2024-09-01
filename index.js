require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');


const authRouter = require('./src/routes/authRoutes');
const eventsRouter = require('./src/routes/eventsRoutes');
const profileRouter = require('./src/routes/profileRoutes');
const helpRouter = require('./src/routes/helpRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com");
  next();
});

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; connect-src 'self' https://noneed-9x5k.onrender.com; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;"
  );
  next();
});


app.use(cors({
  origin: 'https://noneed-9x5k.onrender.com'  // Разрешаем только этот источник
}));


app.use(express.json());


app.use('/auth', authRouter);
app.use('/events', eventsRouter);
app.use('/profile', profileRouter);
app.use('/help', helpRouter);


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});



app.use((err, req, res, next) => {
  console.error(err.stack);  
  res.status(500).send('Something broke!');
});


app.use(express.static(path.join(__dirname, 'client/build')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Пример добавления маршрута для проверки соединения с базой данных
app.get('/api/check-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1 + 1 AS result');
    res.status(200).json({ success: true, result: result.rows[0].result });
  } catch (err) {
    console.error('Ошибка при проверке соединения с базой данных:', err);
    res.status(500).json({ success: false, error: 'Ошибка соединения с базой данных' });
  }
});
