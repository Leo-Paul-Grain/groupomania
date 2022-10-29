const UserModel = require('../models/user.model');
const multer = require('multer');
const fs = require('fs'); //module de node pour gérer les fichiers

/*Upload d'une photo de profil
*les vérifications sur le type et la taille du fichier sont gérés par multer (multer-config.js) et la route (user.routes.js)
*si le fichier ne passe pas les vérifications on arrive même pas au controller car on appelle pas next()
*Si on y arrive on vérifie par sécurité que l'id du token d'authentification est le même que l'id passé dans le body de la requête
*si c'est bon on utilise findByIdAndUpdate avec l'opérateur $set pour mettre à jour le chemin de sa photo dans la BDD
*/
module.exports.uploadProfil = async (req, res) => {
    try {
        if (req.auth.userId != req.body.userId) {
            return res.status(401).send('Unauthorized User');
        } else {
            const user = await UserModel.findByIdAndUpdate(
                req.body.userId,
                { $set: {picture: "./uploads/" + req.file.filename}},
                {new: true, upsert: true, setDefaultsOnInsert: true},
            );
            if (user) {
                res.send(user)
            } else {
                res.status(500).send({ });
            }
        }
    } catch(err) {
        console.error(err);
        return res.status(413).send({ errors: "L'image dépasse 5 mo" })
    }
};