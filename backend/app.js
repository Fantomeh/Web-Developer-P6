// Importer la bibliothèque 'express' pour créer une application
const express = require('express');
// Importer 'body-parser' pour analyser les requêtes entrantes
const bodyParser = require('body-parser');
// Importer 'path' pour gérer les chemins de fichiers
const path = require('path');
// Créer une nouvelle application 'express'
const app = express();

// Importer les routeurs pour les sauces et les utilisateurs
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Importer 'mongoose' pour faciliter la gestion des données avec MongoDB
const mongoose = require('mongoose');

// Se connecter à la base de données MongoDB
mongoose
  .connect("mongodb+srv://test:test94@cluster0.mlc9cxb.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Utiliser le middleware 'express.json()' pour analyser les requêtes entrantes avec des données JSON
app.use(express.json());

// Utiliser un middleware pour définir les en-têtes de réponse pour la gestion des CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Utiliser 'bodyParser.json()' pour analyser les requêtes entrantes avec des données JSON
app.use(bodyParser.json());

// Utiliser les routeurs pour les différentes routes liées aux sauces et aux utilisateurs
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);
// Servir les fichiers statiques du dossier 'images' pour les requêtes vers '/images'
app.use("/images", express.static(path.join(__dirname, "images")));

// Exporter l'application pour l'utiliser dans d'autres parties de l'application
module.exports = app;