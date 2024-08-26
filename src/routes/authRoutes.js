const express = require('express'); // Импортируем express
const router = express.Router(); // Создаем экземпляр маршрутизатора
const { body, validationResult } = require('express-validator'); // Импортируем валидаторы
const bcrypt = require('bcrypt'); // Импортируем bcrypt
const sql = require('../db'); // Импортируем библиотеку SQL

// Регистрация пользователя
router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('type').isIn(['volunteer', 'seeker', 'organization']),
  async (req, res) => {
    console.log('Registration request body:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, type } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      let userExists;
      if (type === 'volunteer') {
        userExists = await sql`SELECT * FROM volunteers WHERE email = ${email}`;
        if (userExists.length > 0) {
          return res.status(400).json({ message: 'Volunteer with this email already exists' });
        }
        await sql`
          INSERT INTO volunteers (email, password, created_at, updated_at)
          VALUES (${email}, ${hashedPassword}, NOW(), NOW())
        `;
      } else if (type === 'organization') {
        userExists = await sql`SELECT * FROM organizations WHERE email = ${email}`;
        if (userExists.length > 0) {
          return res.status(400).json({ message: 'Organization with this email already exists' });
        }
        await sql`
          INSERT INTO organizations (email, password, created_at, updated_at)
          VALUES (${email}, ${hashedPassword}, NOW(), NOW())
        `;
      } else if (type === 'seeker') {
        userExists = await sql`SELECT * FROM seekers WHERE email = ${email}`;
        if (userExists.length > 0) {
          return res.status(400).json({ message: 'Seeker with this email already exists' });
        }
        await sql`
          INSERT INTO seekers (email, password, created_at, updated_at)
          VALUES (${email}, ${hashedPassword}, NOW(), NOW())
        `;
      } else {
        return res.status(400).json({ message: 'Invalid user type' });
      }

      res.status(201).json({ message: 'User successfully registered' });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router; // Экспортируем маршрутизатор
