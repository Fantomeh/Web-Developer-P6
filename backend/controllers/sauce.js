const Sauce = require("../models/Sauce");
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    console.log(req.body)
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;

    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [' '],
        usersdisLiked: [' '],
    });

    sauce
    .save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

// Fonction pour récupérer une sauce spécifique en fonction de son ID
exports.getOneSauce = (req, res, next) => {
    // Utiliser la méthode 'findOne()' pour trouver la sauce avec l'ID correspondant
    Sauce.findOne({
        _id: req.params.id,
    })
        .then((foundSauce) => {
            // Si la sauce est trouvée, renvoyer le statut 200 (OK) et la sauce en format JSON
            res.status(200).json(foundSauce);
        })
        .catch((error) => {
            // Si une erreur se produit, renvoyer le statut 404 (Not Found) et l'erreur en format JSON
            res.status(404).json({
                error: error,
            });
        });
};

exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file
        ? {
              ...req.body,
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body };

    const updatedSauce = new Sauce({
        _id: req.params.id,
        ...sauceObject,
    });

    Sauce.updateOne({ _id: req.params.id }, updatedSauce)
        .then(() => {
            res.status(200).json({
                message: "Sauce modifiée",
            });
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

// Fonction pour supprimer une sauce spécifique en fonction de son ID
exports.deleteSauce = (req, res, next) => {
    // Trouver la sauce avec l'ID correspondant
    Sauce.findOne({ _id: req.params.id })
        .then((foundSauce) => {
            // Vérifier si l'utilisateur qui tente de supprimer la sauce est le créateur de la sauce
            if (foundSauce.userId !== req.auth.userId) {
                // Si ce n'est pas le cas, renvoyer un statut 401 (Non autorisé) et un message d'erreur
                res.status(401).json({ message: 'Not authorized' });
            } else {
                // Extraire le nom du fichier de l'URL de l'image
                const filename = foundSauce.imageUrl.split('/images/')[1];
                // Supprimer le fichier image
                fs.unlink(`images/${filename}`, () => {
                    // Supprimer la sauce
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => {
                            // Si la suppression est réussie, renvoyer un statut 200 (OK) et un message de confirmation
                            res.status(200).json({ message: 'Sauce deleted!' });
                        })
                        .catch((error) => {
                            // Si une erreur se produit, renvoyer un statut 400 (Bad Request) et l'erreur en format JSON
                            res.status(400).json({ error });
                        });
                });
            }
        })
        .catch((error) => {
            // Si une erreur se produit lors de la recherche de la sauce, renvoyer un statut 500 (Internal Server Error) et l'erreur en format JSON
            res.status(500).json({ error });
        });
};


exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};


exports.likeDislikeSauce = (req, res, next) => {
    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id

    switch (like) {
        case 1:
            Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 } })
                .then(() => res.status(200).json({ message: `J'aime` }))
                .catch((error) => res.status(400).json({ error }))

            break;

        case 0:
            Sauce.findOne({ _id: sauceId })
                .then((sauce) => {
                    if (sauce.usersLiked.includes(userId)) {
                        Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
                            .then(() => res.status(200).json({ message: `Neutre` }))
                            .catch((error) => res.status(400).json({ error }))
                    }
                    if (sauce.usersDisliked.includes(userId)) {
                        Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
                            .then(() => res.status(200).json({ message: `Neutre` }))
                            .catch((error) => res.status(400).json({ error }))
                    }
                })
                .catch((error) => res.status(404).json({ error }))
            break;

        case -1:
            Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } })
                .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })
                .catch((error) => res.status(400).json({ error }))
            break;

        default:
            console.log(error);
    }
}