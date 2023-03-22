// Importer la bibliothèque 'jsonwebtoken' pour travailler avec les JSON Web Tokens (JWT)
const jwt = require("jsonwebtoken");

// Créer un middleware pour vérifier et décoder les tokens JWT dans les requêtes entrantes
module.exports = (req, res, next) => {
  try {
    // Récupérer le token JWT de l'en-tête 'Authorization' de la requête
    const token = req.headers.authorization.split(" ")[1];

    // Vérifier et décoder le token en utilisant la clé secrète 'RANDOM_TOKEN_SECRET'
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");

    // Récupérer l'ID de l'utilisateur du token décodé
    const userId = decodedToken.userId;

    // Ajouter l'objet 'auth' à la requête avec l'ID de l'utilisateur
    req.auth = {
      userId: userId,
    };

    // Passer au prochain middleware ou routeur
    next();
  } catch (error) {
    // En cas d'erreur lors de la vérification du token, envoyer une réponse avec le statut 401 (Non autorisé) et l'erreur
    res.status(401).json({ error });
  }
};
