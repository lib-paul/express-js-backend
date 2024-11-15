// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('No se pudo conectar a MongoDB', err));

// Rutas dinamicas
app.use('/api/users', userRoutes);
app.use('/api/tp', require('./routes/trabajopracticoRoutes'));

// Ruta para saludar
app.get('/', (req, res) => {
  res.send('Hola, API funcionando correctamente');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
