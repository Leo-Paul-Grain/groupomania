const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/error.utils');


//Le token est généré à partir de l'id de utilisateur
const createToken = (id, isAdmin) => {
    return jwt.sign({id, isAdmin}, process.env.TOKEN_SECRET, {
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
        res.status(200).send({errors}) //ici on ne devrait pas renvoyer un statut 200 puisque c'est un échec
    }                                  //mais si on renvoie un statut 400 on ne passe jamais au .then qui suit la requête en front et on ne récupère donc pas les erreurs a afficher. Donc j'ai fait une exception
};

module.exports.signIn = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await UserModel.login(email, password); //cherche l'utilisateur dans la base et stock dans une variable user
        const token = createToken(user._id, user.isAdmin); //créé un token contenant l'id de l'utilisateur et le statut admin
        res.cookie('jwt', token, { httpOnly: true, maxAge: 86400000}); // créé un cookie avec en paramètres : son nom, sa valeur, et l'option httpOnly qui complique la récupération du cookie par du code JS malveillant
        res.status(200).json({ message: 'User logged in'})
    } catch (err) {
        const errors = signInErrors(err);
        res.status(200).json({ errors }); //pareil que pour signUp, un statut 400 ne permettrait pas de récuperer les erreurs en front car le .then qui suit la requête ne s'éxécute jamais
    }
};


module.exports.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 }); //défini la durée du cookie sur 1 milliseconde pour le faire deisparaitre
    res.status(200).json({ message: "cookie removed" })
    res.redirect('/');
};