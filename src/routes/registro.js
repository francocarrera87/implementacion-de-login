const express = require('express');
const session = require('express-session');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const User = require('./dao/models/users');
const bcrypt = require('bcryptjs');

// Configuración de la aplicación
const app = express();
const port = 3000;

// Configuración de sesiones
app.use(session({
  secret: 'clave secreta dificil de adivinar', // Cambia a una clave más segura
  resave: false,
  saveUninitialized: false,
}));

// Configuración de handlebars
app.set('view engine', 'handlebars');
app.set('views', './views');
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
}));

// Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/usuarios', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Rutas de la aplicación
app.get('/', (req, res) => {
  res.render('home');
});

// Ruta de registro
const registroRouter = require('./routes/registro');
app.use('/registro', registroRouter);

// Ruta de login
const loginRouter = require('./routes/login');
app.use('/login', loginRouter);

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  const user = await User.findOne({ correo });

  if (!user) {
    req.flash('errors', ['Usuario no encontrado']);
    return res.redirect('/login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    req.flash('errors', ['Contraseña incorrecta']);
    return res.redirect('/login');
  }

  req.session.user = user._id;
  req.session.save(() => {
    res.redirect('/');
  });
});

// Ruta de logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Middleware para verificar la sesión
const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    req.flash('errors', ['Debes iniciar sesión']);
    return res.redirect('/login');
  }

  next();
};

// Ruta protegida por la sesión
app.get('/profile', authMiddleware, (req, res) => {
  res.render('profile', { user: req.session.user });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor funcionando en el puerto ${port}`);
});
