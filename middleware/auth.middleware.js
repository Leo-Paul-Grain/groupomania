const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

/* OLD : Middleware with token in headers
module.exports.checkUser = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'process.env.TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
    next();
    } catch(error) {
        res.status(401).json({ message: 'invalid or unknown token' })
    }
};


*/
/*On récupère le token dans les cookies
* on le vérifie 
*on récupère l'id qu'on avait passé dans le payload du token 
*on le passe en objet de la requête
*on next
*si on arrive pas a vérifier le token on catch et comme on ne next pas, les controllers ne seront pas appellés sur les routes protégés
*/

module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.cookie('jwt', '', {maxAge:1 });
                next();
            } else {
                const userId = decodedToken.id
                const isAdmin = decodedToken.isAdmin
                req.auth = {
                    userId: userId,
                    isAdmin: isAdmin
                }
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
/*OLD
module.exports.checkUser = (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decodedToken.id;
        req.auth = {
            userId: userId
        };
    next();
    } catch(error) {
        res.status(401).json({ message: 'invalid or unknown token' })
    }
};
*/

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
                res.send(200).json('no token')
            } else {
                console.log("User connected is : " + decodedToken.id);
                next();
            }
        });
    } else {
        console.log('No token');
    }
}