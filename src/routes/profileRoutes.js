const express = require('express');
const sql = require('../db'); // Импорт соединения с базой данных
const router = express.Router();

// Получение данных профиля пользователя
router.get('/:userId/:type', async (req, res) => {
  const { userId, type } = req.params;

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
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Обновление данных профиля пользователя
router.put('/:userId/:type', async (req, res) => {
  const { userId, type } = req.params;
  const updateData = req.body;

  try {
    if (type === 'volunteer') {
      await sql`
        UPDATE volunteers 
        SET birthday = ${updateData.birthday}, 
            phone = ${updateData.phone}, 
            city = ${updateData.city}, 
            fields = ${updateData.fields}, 
            skills = ${updateData.skills}, 
            experience = ${updateData.experience} 
        WHERE id = ${userId}`;
    } else if (type === 'seeker') {
      await sql`
        UPDATE seekers 
        SET first_name = ${updateData.first_name}, 
            last_name = ${updateData.last_name}, 
            city = ${updateData.city}, 
            description = ${updateData.description}, 
            phone = ${updateData.phone} 
        WHERE id = ${userId}`;
    } else if (type === 'organization') {
      await sql`
        UPDATE organizations 
        SET name = ${updateData.name}, 
            city = ${updateData.city}, 
            phone = ${updateData.phone}, 
            description = ${updateData.description}, 
            address = ${updateData.address} 
        WHERE id = ${userId}`;
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    res.status(200).send('Profile updated successfully');
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
