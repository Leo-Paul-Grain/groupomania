const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');
const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');
const multer = require('../middleware/multer-config');
//const upload = multer();

//Routes d'authentification
router.post('/register', authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout', authController.logout);

//Read, update, delete Users
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getOneUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

//upload image de profil
router.post('/upload', multer, uploadController.uploadProfil);

module.exports = router;