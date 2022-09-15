const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');


/*
*on récupère le token dans le cookie
*si on a bien trouvé le token, on le vérifie
*res.locals est un objet qui contient des variables locales de réponse qui n'existent qui pendant le cycle de demande/réponse
*ici on l'utilise pour définir user sur null dans le cas ou il y aurait une erreur lors de la vérification du token
*en cas d'erreur on donne aussi 1 milliseconde de validité au token pour le faire disparaitre
*si il n'y a pas d'erreur on cherche l'utilisateur dans la base grâce à son id, contenu dans le token decodé'
*on envoie le user dans une variable de réponse locale
*si il n'y a pas de cookie du tout on défini aussi le user sur null
*/
module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) =>{
            if (err) {
                res.locals.user = null;
                res.cookie('jwt', '', { maxAge:1 });
                next();
            } else {
                let user = await UserModel.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}
/*
*On récupère le token
*si on a bien un token on le vérifie
*si le token n'est pas bon on log l'erreur et on s'arrête la puisqu'on appelle pas next
*sinon on log l'id de l'utilisateur connecté dans la console et on next
*/
module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err);
            } else {
                console.log("User connected is : " + decodedToken.id);
                next();
            }
        });
    } else {
        console.log('No token');
    }
}