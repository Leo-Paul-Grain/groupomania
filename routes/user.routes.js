const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');
const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');
const multer = require('../middleware/multer-config');
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

//upload image de profil
router.post('/upload', checkUser, multer, uploadController.uploadProfil);

module.exports = router;