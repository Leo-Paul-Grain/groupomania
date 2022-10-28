const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;
const jwt = require('jsonwebtoken');
const { uploadErrors } = require('../utils/error.utils');

module.exports.readPost = (req, res) => {
    PostModel.find((err, data) => {
        if (!err) res.send(data);
        else console.log('Error to get data : ' + err);
    }).sort({ createdAt: -1 }); //methode mongoose qui permet d'afficher les posts du plus récent au plus ancien (c'est l'inverse par défaut)
};


module.exports.createPost = async (req, res) => {
    if (!!req.file) {
        try {
            if (req.file.mimetype !== "image/jpg" && req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpeg")
                throw Error("invalid file"); 
        
            if (req.file.size > 2000000) throw Error("max size exceeded");
        } catch (err) {
            const errors = uploadErrors(err)
            return res.status(200).json({ errors }); //ici on ne devrait pas renvoyer un statut 200 puisque c'est un échec
        }                                            //mais si on renvoie un statut 400 on ne passe jamais au .then qui suit la requête en front et on ne récupère donc pas les erreurs a afficher. Donc j'ai fait une exception
    };

    const newPost = new PostModel({
        posterId: req.body.posterId,
        message: req.body.message,
        picture: !!req.file ? "./uploads/" + req.file.filename : "",
        video: req.body.video,
        likers: [],
        comments: [],
    });
    try {
        const post = await newPost.save();
        return res.status(201).json({message: 'Post created :' + post});
    } catch (err) {
        return res.status(400).send(err);
    }
}

/*On récupére le nouveau message dans le body et on le stocke dans une variable
*On cherche le post à update d'après son id passé en paramètres
*on vérifie grâce à l'id passé par le middleware checkUser que l'auteur de la requête est bien l'auteur du post
*si ce n'est pas le cas on return une erreur
*si c'est bien lui on fait l'update
*/
module.exports.updatePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) //vérifie que l'id est bien un ObjectId MongoDB valide
        return res.status(400).send('ID unknown : ' + req.params.id);
    
    const updatedPost = {
        message: req.body.message
    }


    PostModel.findOne({_id: req.params.id})
        .then((post) => {
            if (req.auth.userId != post.posterId && req.auth.admin === false) {
                return res.status(401).send('Unauthorized User');
            } else {
                PostModel.updateOne({ _id: req.params.id }, { $set : updatedPost})
                    .then(() => res.status(200).json({message: "Post udpated"}))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
          });
};

module.exports.deletePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) 
        return res.status(400).send('ID unknown : ' + req.params.id);

    PostModel.findOne({ _id: req.params.id})
    .then((post) => {
        if (req.auth.userId != post.posterId && req.auth.admin === false) {
            return res.status(401).send('Unauthorized User');
        } else {
            PostModel.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({message: "Post deleted"}))
                .catch(error => res.status(400).json({ error }));
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
      });
};

module.exports.likePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) 
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {$addToSet: { likers: req.auth.userId }},
            { new: true }
        )
        .then((data) => res.send(data))
        .catch((err) => res.status(400).send({ message: err }));
        
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.unlikePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) //est ce que l'id existe dans la base de données ?
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {$pull: { likers: req.auth.userId }},
            { new: true }
        )
        .then((data) => res.send(data))
        .catch((err) => res.status(400).send({ message: err }));
            
    } catch (err) {
        return res.status(400).send(err);
    }
};


module.exports.commentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.auth.userId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text
                    }
                }
            },
            { new: true }
        )
        .then((data) => res.send(data))
        .catch((err) => res.status(400).send({ message: err }));
    } catch (err) {
        return res.status(400).send(err);
    }
};

/* On vérifie que l'id passé en paramètre est un ObjectId mongoDB valide
*on utilise la méthode findOne pour trouver le post qui correspond à l'id passé en param puis le commentaire à éditer (qui correspond au commentId passé en body)
*On vérifie que l'id contenu dans le token d'identification est le même que l'id de la personne qui a créée le commentaire
*si c'est bon on utilise udpateOne pour éditer le commentaire
*/
module.exports.editCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);
    
    PostModel.findOne({ _id: req.params.id, "comments._id": req.body.commentId}, "comments.$")
    .then((theComment) => {
        if (req.auth.userId != theComment.comments[0].commenterId && req.auth.admin === false) { 
            return res.status(401).send('Unauthorized User');
        } else {
            PostModel.updateOne(
                { "_id": req.params.id, 'comments._id': req.body.commentId},  
                { $set: {'comments.$.text': req.body.text} }
                )
                .then(() => res.status(200).json({message: "Comment udpated"}))
                .catch(error => res.status(400).json({ error }));
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
};


/* On cherche le post dans la base
*on check si l'id du token d'authentification est le même que celui de l'auteur du post
*si c'est bon on fait un updateOne comme dans editCommentPost juste au dessus, mais on utilise l'opérateur $pull pour retirer le commentaire
*/

module.exports.deleteCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    PostModel.findOne({ _id: req.params.id}, {comments: {$elemMatch: {_id: req.body.commentId}}})
    .then((theComment) => {
        if (req.auth.userId != theComment.comments[0].commenterId && req.auth.admin === false) {
            return res.status(401).send('Unauthorized User');
        } else {
            PostModel.updateOne(
                { "_id": req.params.id, 'comments._id': req.body.commentId},  
                { $pull: {comments: {_id: req.body.commentId}} }
                )
                .then(() => res.status(200).json({message: "Comment deleted"}))
                .catch(error => res.status(400).json({ error }));
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
};