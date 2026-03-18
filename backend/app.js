const express = require('express');
const mongoose = require('mongoose'); 
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb+srv://chris_972:charlieprout91@p7.byyxzpp.mongodb.net/?appName=P7')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée ! Erreur :', error));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api', (req, res, next) => {
  res.status(200).json({ message: 'Ton serveur Express fonctionne à merveille !' });
});

app.use('/api/auth', userRoutes);
module.exports = app;