const UserModel = require('../models/user.model');

module.exports.signUp = async (req, res) => {
    const {pseudo, email, password} = req.body //equivalent a : const pseudo = req.body.pseudo, const email = req.body.email, etc.
    try {
        const user = await UserModel.create({pseudo, email, password});
        res.status(201).json({ message: `Utilisateur créé.` });
    }
    catch(err) {
        res.status(400).send({ err })
    }
}