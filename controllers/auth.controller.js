const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/error.utils');


//Le token est généré à partir de l'id de utilisateur
const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
        expiresIn: "24h"
    })
};

module.exports.signUp = async (req, res) => {
    const {pseudo, email, password} = req.body //equivalent a : const pseudo = req.body.pseudo, const email = req.body.email, etc.
    try {
        const user = await UserModel.create({pseudo, email, password});
        res.status(201).json({ message: `Utilisateur créé : ` + user });
    }
    catch(err) {
        const errors = signUpErrors(err)
        res.status(400).send({errors})
    }
}

module.exports.signIn = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await UserModel.login(email, password); //cherche l'utilisateur dans la base et stock dans une variable user
        const token = createToken(user._id); //créé un token à partir de l'id de l'utilisateur
        res.cookie('jwt', token, { httpOnly: true, maxAge: 86400000}); // créé un cookie avec en paramètres : son nom, sa valeur, et l'option httpOnly qui complique la récupération du cookie par du code JS malveillant
        res.status(200).json({ message: 'User logged in'})
    } catch (err) {
        const errors = signInErrors(err);
        res.status(401).json({ errors });
    }
}

module.exports.logout = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1 }); //défini la durée du cookie sur 1 milliseconde pour le faire deisparaitre
    res.redirect('/'); //si on ne fait pas ça le res.cookie ne marchera pas car il ne constitue pas une requête valide en soi
}