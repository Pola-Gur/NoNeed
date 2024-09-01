const express = require('express');
const sql = require('../db');

const router = express.Router();

router.post('/',
  async (req, res) => {
    const { title, description, type, date } = req.body;

    try {
      await sql`
        INSERT INTO events (title, description, type, date, created_at, updated_at)
        VALUES (${title}, ${description}, ${type}, ${date}, NOW(), NOW())
      `;
      res.status(201).json({ message: 'Событие успешно создано' });
    } catch (error) {
      console.error('Ошибка при создании события:', error);
      res.status(500).send('Ошибка сервера');
    }
  }
);


router.get('/',
  async (req, res) => {
    try {
      const events = await sql`SELECT * FROM events`;
      res.json(events);
    } catch (error) {
      console.error('Ошибка при получении событий:', error);
      res.status(500).send('Ошибка сервера');
    }
  }
);

router.post('/join/volunteer',
  async (req, res) => {
    const { volunteerId, eventId } = req.body;

    try {
      await sql`
        INSERT INTO volunteer_events (volunteer_id, event_id)
        VALUES (${volunteerId}, ${eventId})
      `;
      res.status(201).json({ message: 'Вы успешно присоединились к событию' });
    } catch (error) {
      console.error('Ошибка при присоединении к событию:', error);
      res.status(500).send('Ошибка сервера');
    }
  }
);


router.post('/join/organization',
  async (req, res) => {
    const { organizationId, eventId } = req.body;

    try {
      await sql`
        INSERT INTO organization_events (organization_id, event_id)
        VALUES (${organizationId}, ${eventId})
      `;
      res.status(201).json({ message: 'Вы успешно присоединились к событию' });
    } catch (error) {
      console.error('Ошибка при присоединении к событию:', error);
      res.status(500).send('Ошибка сервера');
    }
  }
);

module.exports = router;
