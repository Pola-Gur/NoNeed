const express = require('express');
const sql = require('../db');

const router = express.Router();


router.get('/requests', async (req, res) => {
  try {
    const requests = await sql`SELECT * FROM help_requests ORDER BY date DESC`;
    res.json(requests);
  } catch (error) {
    console.error('Error while receiving help requests:', error);
    res.status(500).send('Server error');
  }
});


router.post('/requests', async (req, res) => {
  const { title, description, location, date, requesterId, field } = req.body;

  try {
    await sql`
      INSERT INTO help_requests (title, description, location, date, requester_id, field, created_at, updated_at)
      VALUES (${title}, ${description}, ${location}, ${date}, ${requesterId}, ${field}, NOW(), NOW())
    `;
    res.status(201).json({ message: 'Help request successfully added' });
  } catch (error) {
    console.error('Error adding help request:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
