const multer = require('multer');
const maxSize = 5 * 1024 * 1024;

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'client/public/uploads');
  },
  filename: (req, file, callback) => {
    const fileName = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, fileName + Date.now() + '.' + extension);
  }
});

/*Si jamais l'extension de fichier n'est pas bonne, on refuse le fichier
*et on ajoute aussi à la requête un champ fileValidationError qu'on remplit avec l'erreur à renvoyer
*sur la route va ensuite tester si ce champ existe, si c'est le cas on récupère son contenu et on l'envoie avec la réponse
*comme ça on peut dispatch ce contenu dans le store et récupérer l'erreur dedans pour l'afficher au user
*/
const fileFilter = (req, file, callback) => {
  if((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')) {
    callback(null, true);
  } else {
    req.fileValidationError = "Extension de fichier non supportée";
    return callback(null, false, new Error("Extension de fichier non supportée"));
  }
};

module.exports = multer({ storage: storage, fileFilter: fileFilter, limits:{ fileSize: maxSize }}).single('file');