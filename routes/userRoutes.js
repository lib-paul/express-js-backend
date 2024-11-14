// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta para registrar un nuevo usuario.
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, edad, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ nombre, email, edad, password: hashedPassword });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

// Ruta para el inicio de sesión.
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Obtiene todos los usuarios (requiere autenticación) y los muestra en formato de JSON.
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Obtiene un usuario especifico por ID (requiere autenticación).
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Actualiza un usuario por ID (requiere autenticación).
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { nombre, email, edad } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { nombre, email, edad }, { new: true });
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Elimina un usuario por ID (requiere autenticación).
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json({ msg: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
