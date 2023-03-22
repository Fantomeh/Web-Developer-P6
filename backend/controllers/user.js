// Importe les modules bcrypt et jsonwebtoken pour gérer l'authentification
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Importe le modèle User pour interagir avec la base de données
const User = require('../models/User');

// Fonction d'inscription d'un nouvel utilisateur
exports.signup = async (req, res, next) => {
    // Hache le mot de passe de l'utilisateur avec un facteur de salage de 10
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // Crée un nouvel objet utilisateur avec l'email et le mot de passe haché
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // Enregistre le nouvel utilisateur dans la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Fonction de connexion d'un utilisateur existant
exports.login = (req, res, next) => {
    // Recherche un utilisateur avec l'email fourni
    User.findOne({ email: req.body.email })
        .then(user => {
            // Si l'utilisateur n'est pas trouvé, retourne une erreur 401
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // Compare le mot de passe fourni avec le mot de passe haché stocké dans la base de données
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // Si la comparaison échoue, retourne une erreur 401
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // Si la comparaison réussit, retourne l'ID de l'utilisateur et un token JWT
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
