// Importer la bibliothèque 'express' pour créer un routeur
const express = require('express');
// Créer un nouvel objet 'router' pour définir les routes de l'application
const router = express.Router();

// Importer les middlewares 'auth' et 'multer-config' pour sécuriser et gérer les fichiers dans les requêtes
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Importer les contrôleurs 'sauce' pour définir les actions à effectuer pour chaque route
const sauceCtrl = require('../controllers/sauce');

// Définir les routes pour les différentes actions liées aux sauces
// Chaque route utilise le middleware 'auth' pour s'assurer que l'utilisateur est authentifié
router.get('/', auth, sauceCtrl.getAllSauces); // Route pour récupérer toutes les sauces
router.post('/', auth, multer, sauceCtrl.createSauce); // Route pour créer une nouvelle sauce avec gestion des fichiers grâce à 'multer'
router.get('/:id', auth, sauceCtrl.getOneSauce); // Route pour récupérer une sauce spécifique en fonction de son ID
router.put('/:id', auth, multer, sauceCtrl.updateSauce); // Route pour mettre à jour une sauce spécifique en fonction de son ID
router.delete('/:id', auth, sauceCtrl.deleteSauce); // Route pour supprimer une sauce spécifique en fonction de son ID
router.post("/:id/like", auth, sauceCtrl.likeDislikeSauce); // Route pour gérer les "j'aime" et "je n'aime pas" d'une sauce spécifique en fonction de son ID

// Exporter le routeur pour l'utiliser dans d'autres parties de l'application
module.exports = router;
