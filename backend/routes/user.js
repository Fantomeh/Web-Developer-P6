// Importe le module Express pour créer un routeur
const express = require('express');
// Crée un nouvel objet routeur à partir du module Express
const router = express.Router();
// Importe le contrôleur utilisateur pour gérer les requêtes liées aux utilisateurs
const userCtrl = require('../controllers/user');

// Route pour l'inscription d'un nouvel utilisateur
// Appelle la fonction 'signup' du contrôleur utilisateur lorsqu'une requête POST est envoyée à '/signup'
router.post('/signup', userCtrl.signup);
// Route pour la connexion d'un utilisateur existant
// Appelle la fonction 'login' du contrôleur utilisateur lorsqu'une requête POST est envoyée à '/login'
router.post('/login', userCtrl.login);

// Exporte le routeur pour l'utiliser dans d'autres parties de l'application
module.exports = router;
