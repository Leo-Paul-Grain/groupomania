const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');
const userController = require('../controllers/user.controller');

//Routes d'authentification
router.post('/register', authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout', authController.logout);

//Routes liés aux Users
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getOneUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;