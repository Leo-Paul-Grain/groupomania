const UserModel = require('../models/user.model');
const fs = require('fs'); //module de node pour gérer les fichiers
const { promisify } = require('util'); // méthode node qui permet de transformer les callbacks en promesses
const pipeline = promisify(require('stream').pipeline); //stream.pipeline est une méthode node
const { uploadErrors } = require('../utils/error.utils');

/*Si le fichier ne correspond à aucun des 3 formats (MimeType) acceptés, on envoie une erreur
*on vérifie ensuite qu'il n'est pas trop volumineux, si il l'est on envoie une erreur
* on défini le nom de l'image avec le pseudo de l'utilisateur (récupéré dans la requête) + .jpg (les images seront convertit en jpg)
*l'avantage c'est que si il change sa photo de profil l'ancienne sera écrasé car elle a le même nom que la nouvelle
*on appelle le pipeline pour créer le chemin d'accès et stocké le fichier
*/
module.exports.uploadProfil = async (req, res) => {
    try {
        if (req.file.detectedMimeType !== "image/jpg" && req.file.detectedMimeType !== "image/png" && req.file.detectedMimeType !== "image/jpeg")
            throw Error("invalid file"); 
        
        if (req.file.size > 2000000) throw Error("max size exceeded");

    } catch (err) {
        const errors = uploadErrors(err)
        return res.status(201).json({ errors });
    }

    const fileName = req.body.name + ".jpg";

    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/profil/${fileName}`
        )
    )
};