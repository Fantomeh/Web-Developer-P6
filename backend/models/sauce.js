// Importer la bibliothèque 'mongoose' pour faciliter la gestion des données avec MongoDB
const mongoose = require('mongoose');

// Créer un schéma 'sauceSchema' pour définir la structure de la collection 'Sauce' dans la base de données
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true }, // Identifiant de l'utilisateur qui a créé la sauce
  name: { type: String, required: true }, // Nom de la sauce
  manufacturer: { type: String, required: true }, // Fabricant de la sauce
  description: { type: String, required: true }, // Description de la sauce
  mainPepper: { type: String, required: true }, // Ingrédient principal épicé de la sauce
  imageUrl: { type: String, required: true }, // URL de l'image de la sauce
  heat: { type: Number, required: true }, // Niveau d'épice de la sauce
  likes: { type: Number, required: true }, // Nombre total de "j'aime" pour la sauce
  dislikes: { type: Number, required: true }, // Nombre total de "je n'aime pas" pour la sauce
  usersLiked: { type: [String], required: true }, // Tableau des identifiants des utilisateurs qui ont aimé la sauce
  usersDisliked: { type: [String], required: true }, // Tableau des identifiants des utilisateurs qui n'ont pas aimé la sauce
});

// Exporter le modèle 'Sauce' basé sur le schéma 'sauceSchema', pour l'utiliser dans d'autres parties de l'application
module.exports = mongoose.model('Sauce', sauceSchema);
