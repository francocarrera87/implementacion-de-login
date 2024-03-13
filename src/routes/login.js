const express = require('express');
const router = express.Router();
const User = require('../dao/models/user');
const bcrypt = require('bcryptjs');

// Mostrar formulario de login
router.get('/login', (req, res) => {
  res.render('login', { errors: req.flash('errors') });
});

// Procesar login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    req.flash('errors', ['Usuario o contraseña incorrectos']);
    return res.redirect('/login');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    req.flash('errors', ['Usuario o contraseña incorrectos']);
    return res.redirect('/login');
  }

  // Iniciar sesión
  req.session.user = user._id;
  req.session.save(() => {
    res.redirect('/');
  });
});

module.exports = router;
