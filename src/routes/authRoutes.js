const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const sql = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'sod_sod';

// Регистрация пользователя
router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, type } = req.body;

    try {
      const userExists = await sql`SELECT * FROM seekers WHERE email = ${email}`;
      if (userExists.length > 0) {
        return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await sql`
        INSERT INTO seekers (type, name, email, password, created_at, updated_at)
        VALUES (${type}, ${name}, ${email}, ${hashedPassword}, NOW(), NOW())
      `;

      res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (error) {
      console.error('Ошибка при регистрации пользователя:', error);
      res.status(500).send('Ошибка сервера');
    }
  }
);

// Вход пользователя
router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await sql`SELECT * FROM seekers WHERE email = ${email}`;
      if (user.length === 0) {
        return res.status(400).json({ message: 'Неверный email или пароль' });
      }

      const validPassword = await bcrypt.compare(password, user[0].password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Неверный email или пароль' });
      }

      const token = jwt.sign(
        { userId: user[0].id, email: user[0].email },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token });
    } catch (error) {
      console.error('Ошибка при входе:', error);
      res.status(500).send('Ошибка сервера');
    }
  }
);

// Защищённый маршрут
router.get('/protected', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    res.json({ message: 'Вы получили доступ к защищённому маршруту', user });
  });
});

module.exports = router;
