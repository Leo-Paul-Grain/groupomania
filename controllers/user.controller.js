const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password'); //la méthode select permet de retirer le mot de passe des infos envoyés au front
    res.status(200).json(users);
}

module.exports.getOneUser = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id)
        
    UserModel.findById(req.params.id, (err, data) => {
        if (!err) res.send(data); //si il n'y a pas d'erreur on envoie les infos du user en réponse
        else console.log('ID unknown : ' + err)
    }).select('-password'); //on retire le mot de passe des infos envoyés au front
};

module.exports.updateUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id)

    try {
        UserModel.findOneAndUpdate(        //la méthode findOneAndUpdate prend en 1er paramétre un filtre pour trouver le document à update et en 2eme l'element de ce document à update
            {_id: req.params.id},
            {
                $set: {              //l'opérateur '$set' remplace la valeur d'un champ avec la valeur spécifié
                    bio: req.body.bio
                }
            },
            { new: true, upsert: true, setDefaultOnInsert: true}, //option new : retourne le document après l'update, upsert : si aucun document ne correspond au filtre mongo le crée, setDefaultOnInsert : si il y a upsert mongo insérera valeur par défaut
            (err, data) => {
                if (!err) return res.send(data);
                if (err) return res.status(400).json({ message: err});
            }
        )
    } catch (err) {
        return res.status(500).json({ message: err});
    }
};

module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) 
        return res.status(400).send('ID unknown : ' + req.params.id)
    
        try {
            await UserModel.deleteOne({ _id: req.params.id }).exec();
            res.status(200).json({ message: "User deleted. "});
        } catch (err) {
            return res.status(500).json({ message: err});
        }
}