const UserModel = require('../models/user.model');
const multer = require('multer');
const fs = require('fs'); //module de node pour gérer les fichiers
const { uploadErrors } = require('../utils/error.utils');


module.exports.uploadProfil = async (req, res) => {
    try {
        if (req.file.mimetype !== "image/jpg" && req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpeg")
            throw Error("invalid file"); 
    
        if (req.file.size > 2000000) throw Error("max size exceeded");
    } catch (err) {
        const errors = uploadErrors(err)
        return res.status(201).json({ errors });
    }

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
        return res.status(500).send({ message: err })
    }
};