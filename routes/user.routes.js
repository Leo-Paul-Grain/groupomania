const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');
const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');
const multer = require('../middleware/multer-config');
const fileValidationError = require('../middleware/multer-config');
const { checkUser } = require('../middleware/auth.middleware');

//Routes d'authentification
router.post('/register', authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout', authController.logout);

//Read, update, delete Users
router.get('/', checkUser, userController.getAllUsers);
router.get('/:id', checkUser, userController.getOneUser);
router.put('/:id', checkUser, userController.updateUser);
router.delete('/:id', checkUser, userController.deleteUser);

/*upload image de profil
/Le fileFilter de multer va rejeter le fichier si son extension n'est pas bonne
*ensuite il ajoute à la requête une propriété fileValidationError qu'il remplit avec l'erreur à afficher au user
*sur la route on test si la propriété existe, si c'est le cas on stop la requête, on récupère l'erreur et on l'envoie avec la réponse
*(si le champ n'existe pas par contre c'est qu'on a passé la validation donc on next pour passer au controller)
*comme ça on peut dispatch ce contenu dans le store et récupérer l'erreur dedans pour l'afficher immédiatement au user
*/
router.post('/upload', checkUser, function(req, res, next){
    multer(req, res, function(err) {
        if(req.fileValidationError) {
            const errors = req.fileValidationError
            return res.status(400).json({ errors });
        } else {
            next()
        };
    })
}, uploadController.uploadProfil);
    
module.exports = router;