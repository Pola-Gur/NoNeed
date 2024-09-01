const express = require('express'); // Импортируем express
const router = express.Router(); // Создаем экземпляр маршрутизатора
const { body, validationResult } = require('express-validator'); // Импортируем валидаторы
const bcrypt = require('bcrypt'); // Импортируем bcrypt
const sql = require('../db'); // Импортируем библиотеку SQL
const jwt = require('jsonwebtoken'); // Импортируем jwt для генерации токенов

// Регистрация пользователя
router.post('/register',
  // Общие проверки
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

    const { email, password, type, firstName, lastName, city, description, address, phone, name } = req.body;

    // Проверяем, что обязательные поля для конкретного типа пользователя предоставлены
    if (type === 'volunteer') {
      if (!firstName || !lastName) {
        return res.status(400).json({ message: 'First name and last name are required for volunteers' });
      }
    } else if (type === 'seeker') {
      if (!firstName || !lastName) {
        return res.status(400).json({ message: 'First name and last name are required for seekers' });
      }
    } else if (type === 'organization') {
      if (!name) {
        return res.status(400).json({ message: 'Organization name is required' });
      }
    }

    console.log('User type:', type);
    console.log('Password:', password); // Не показывайте пароль в реальном приложении!

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      let userExists;
      if (type === 'volunteer') {
        userExists = await sql`SELECT * FROM volunteers WHERE email = ${email}`;
        if (userExists.length > 0) {
          return res.status(400).json({ message: 'Volunteer with this email already exists' });
        }
        await sql`
          INSERT INTO volunteers (email, password, created_at, updated_at, first_name, last_name)
          VALUES (${email}, ${hashedPassword}, NOW(), NOW(), ${firstName}, ${lastName})
        `;
      } else if (type === 'organization') {
        userExists = await sql`SELECT * FROM organizations WHERE email = ${email}`;
        if (userExists.length > 0) {
          return res.status(400).json({ message: 'Organization with this email already exists' });
        }
        await sql`
          INSERT INTO organizations (email, password, created_at, updated_at, name, city, phone, description, address)
          VALUES (${email}, ${hashedPassword}, NOW(), NOW(), ${name}, ${city}, ${phone}, ${description}, ${address})
        `;
      } else if (type === 'seeker') {
        userExists = await sql`SELECT * FROM seekers WHERE email = ${email}`;
        if (userExists.length > 0) {
          return res.status(400).json({ message: 'Seeker with this email already exists' });
        }
        await sql`
          INSERT INTO seekers (email, password, created_at, updated_at, first_name, last_name, city, description, address, phone)
          VALUES (${email}, ${hashedPassword}, NOW(), NOW(), ${firstName}, ${lastName}, ${city}, ${description}, ${address}, ${phone})
        `;
      } else {
        return res.status(400).json({ message: 'Invalid user type' });
      }

      res.status(201).json({ message: 'User successfully registered' });
    } catch (error) {
      console.error('Registration error:', error); // Логируем ошибку
      res.status(500).send('Server error');
    }
  }
);

// Логин пользователя
router.post('/login', async (req, res) => {
  const { email, password, type } = req.body;

  try {
    let user;
    if (type === 'volunteer') {
      user = await sql`SELECT * FROM volunteers WHERE email = ${email}`;
    } else if (type === 'organization') {
      user = await sql`SELECT * FROM organizations WHERE email = ${email}`;
    } else if (type === 'seeker') {
      user = await sql`SELECT * FROM seekers WHERE email = ${email}`;
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    if (user.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Генерация JWT
    const token = jwt.sign({ id: user[0].id, type: type }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router; 
