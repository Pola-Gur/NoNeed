const express = require('express');
const sql = require('../db');

const router = express.Router();

// Получение данных профиля пользователя
router.get('/:userId/:type', async (req, res) => {
  const { userId, type } = req.params;

  // Логирование полученных параметров
  console.log('Fetching profile for userId:', userId, 'type:', type);

  try {
    let profile;
    if (type === 'volunteer') {
      profile = await sql`SELECT * FROM volunteers WHERE id = ${userId}`;
    } else if (type === 'seeker') {
      profile = await sql`SELECT * FROM seekers WHERE id = ${userId}`;
    } else if (type === 'organization') {
      profile = await sql`SELECT * FROM organizations WHERE id = ${userId}`;
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

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
