const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');               

// Ce module utilise le package 'multer' pour gérer le téléchargement des fichiers image. Il définit un objet 'MIME_TYPES' pour associer les types MIME des images aux extensions de fichier correspondantes.

// Un objet 'storage' est créé à l'aide de la fonction 'multer.diskStorage()', qui détermine la destination et le nom des fichiers téléchargés. La destination est définie sur le dossier 'images',
// et le nom du fichier est créé à partir du nom original du fichier en remplaçant les espaces par des underscores, en ajoutant un horodatage et en ajoutant l'extension appropriée en fonction du type MIME.

// Finalement, le module exporte une instance de multer configurée avec l'objet 'storage' et spécifie que le téléchargement doit être limité à un seul fichier image.
