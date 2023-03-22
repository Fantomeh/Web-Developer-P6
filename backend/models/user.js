// Fichier : models/User.js

// Importer les modules nécessaires
const mongoose = require('mongoose');

// Créer un schéma utilisateur avec les propriétés 'email' et 'password'
const userSchema = mongoose.Schema({
  // Le champ 'email' est obligatoire et unique
  email: {
    type: String,
    required: true,
    unique: true,
    // Ajout d'une validation d'email de base avec une expression régulière
    validate: {
      validator: function (email) {
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
      },
      message: (props) => `${props.value} n'est pas un email valide`,
    },
  },
  // Le champ 'password' est obligatoire
  password: { type: String, required: true },
});

// Exporter le modèle 'User' basé sur le schéma utilisateur
module.exports = mongoose.model('User', userSchema);
