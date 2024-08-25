const express = require('express');
const sql = require('../db');

const router = express.Router();

// Получение всех запросов о помощи
router.get('/', async (req, res) => {
  try {
    const requests = await sql`SELECT * FROM help_requests ORDER BY date DESC`;
    res.json(requests);
  } catch (error) {
    console.error('Ошибка при получении запросов о помощи:', error);
    res.status(500).send('Ошибка сервера');
  }
});

// Добавление запроса о помощи
router.post('/', async (req, res) => {
  const { title, description, location, date, requesterId, field } = req.body;

  try {
    await sql`
      INSERT INTO help_requests (title, description, location, date, requester_id, field, created_at, updated_at)
      VALUES (${title}, ${description}, ${location}, ${date}, ${requesterId}, ${field}, NOW(), NOW())
    `;
    res.status(201).json({ message: 'Запрос о помощи успешно добавлен' });
  } catch (error) {
    console.error('Ошибка при добавлении запроса о помощи:', error);
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router;
