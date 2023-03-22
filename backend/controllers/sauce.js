// Importe le modèle Sauce et le module de système de fichiers (fs)
const Sauce = require("../models/Sauce");
const fs = require('fs');

// Fonction pour créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;

    // Crée un nouvel objet sauce avec les informations reçues et initialise les likes et les dislikes
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [' '],
        usersdisLiked: [' '],
    });

    // Enregistre la sauce dans la base de données
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

// Fonction pour récupérer une sauce spécifique en fonction de son ID
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((foundSauce) => { res.status(200).json(foundSauce); })
        .catch((error) => { res.status(404).json({ error: error }); });
};

// Fonction pour mettre à jour une sauce
exports.updateSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((foundSauce) => {
            console.log()

            const sauceObject = req.file
                ? {
                    ...req.body,
                    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                }
                : { ...req.body };

            const updatedSauce = new Sauce({ _id: req.params.id, ...sauceObject, usersLiked: foundSauce.usersLiked, usersDisliked: foundSauce.usersDisliked });


            Sauce.updateOne({ _id: req.params.id }, updatedSauce)
                .then(() => { res.status(200).json({ message: "Sauce modifiée" }); })
                .catch((error) => { res.status(400).json({ error: error }); });

        })
        .catch((error) => { res.status(500).json({ error }); });

};

// Fonction pour supprimer une sauce spécifique en fonction de son ID
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((foundSauce) => {
            if (foundSauce.userId !== req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = foundSauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Sauce deleted!' }); })
                        .catch((error) => { res.status(400).json({ error }); });
                });
            }
        })
        .catch((error) => { res.status(500).json({ error }); });
};

// Fonction pour récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => { res.status(200).json(sauces); })
        .catch((error) => { res.status(400).json({ error: error }); });
};

// Fonction pour gérer les likes et les dislikes d'une sauce
exports.likeDislikeSauce = (req, res, next) => {
    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id

    // Utilise un switch pour gérer les différents cas de like et de dislike
    switch (like) {
        case 1: // Cas de like
            Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 } })
                .then(() => res.status(200).json({ message: `J'aime` }))
                .catch((error) => res.status(400).json({ error }))
            break;

        case 0: // Cas de neutralité
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

        case -1: // Cas de dislike
            Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } })
                .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })
                .catch((error) => res.status(400).json({ error }))
            break;
        default:
            console.log(error);
    }
}