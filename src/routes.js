const express = require('express');
const sql = require('./db');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello from new No Need server!');
});

router.get('/check-db', async (req, res) => {
  try {
    const result = await sql`select version()`;
    res.send(`Database connected: ${result[0].version}`);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send('Error');
  }
});

module.exports = router;
