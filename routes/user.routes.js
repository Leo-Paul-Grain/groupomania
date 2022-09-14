const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');
const userController = require('../controllers/user.controller');

router.post('/register', authController.signUp);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getOneUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;