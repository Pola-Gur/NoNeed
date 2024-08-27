const express = require('express');
const sql = require('../db');

const router = express.Router();

// Получение данных профиля пользователя
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  // Логирование полученного userId
  console.log('Fetching profile for userId:', userId);

  try {
    const profile = await sql`SELECT * FROM seekers WHERE id = ${userId}`;
    if (profile.length === 0) {
      return res.status(404).json({ message: 'Профиль не найден' });
    }
    res.json(profile[0]);
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

module.exports = router;
