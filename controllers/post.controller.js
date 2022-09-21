const postModel = require('../models/post.model');
const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.readPost = (req, res) => {
    PostModel.find((err, data) => {
        if (!err) res.send(data);
        else console.log('Error to get data : ' + err);
    }).sort({ createdAt: -1 }); //methode mongoose qui permet d'afficher les posts du plus récent au plus ancien (c'est l'inverse par défaut)
};

module.exports.createPost = async (req, res) => {
    const newPost = new postModel({
        posterId: req.body.posterId,
        message: req.body.message,
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

module.exports.updatePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) //est ce que l'id existe dans la base de données ?
        return res.status(400).send('ID unknown : ' + req.params.id);

    const updatedPost = {
        message: req.body.message
    }

    PostModel.findByIdAndUpdate(  //la méthode findOneAndUpdate prend en 1er paramétre un filtre pour trouver le document à update, en 2eme l'element de ce document à update et en 3 le callback
        req.params.id,
        { $set: updatedPost },
        { new: true },
        (err, data) => {
            if (!err) res.send(data);
            else console.log("Update error : " + err);
        }

    )
}

module.exports.deletePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) //est ce que l'id existe dans la base de données ?
        return res.status(400).send('ID unknown : ' + req.params.id);

    PostModel.findByIdAndDelete(
        req.params.id,
        (err, data) => {
            if (!err) res.send(data);
            else console.log("Delete error : " + err);
        }
    );
};

module.exports.likePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) //est ce que l'id existe dans la base de données ?
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {$addToSet: { likers: req.body.id }},
            { new: true }
        )
        .catch((err) => res.status(400).send({ message: err }));
        
        await UserModel.findByIdAndUpdate(
            req.body.id,
            {
                $addToSet: { postLiked: req.params.id }
            },
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
            {$pull: { likers: req.body.id }},
            { new: true }
        )
        .catch((err) => res.status(400).send({ message: err }));
            
        await UserModel.findByIdAndUpdate(
            req.body.id,
            {
                $pull: { postLiked: req.params.id }
            },
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
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamp: new Date().getTime() //comme les commentaires sont stockés dans une sous BDD on ne peut pas obtenir de timestamp automatique
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

/* On vérifie comme d'habitude que l'id passé en paramètre existe
*on cherche le post dont il faut modifier les commentaires avec l'id passé en paramètre
*on cherche ensuite le commentaire à update de ce post, avec la méthode equals qui va chercher le commentaire dont l'id correspond a l'id passé dans le body
*si on ne le trouve pas on renvoie une erreur
*si on le trouve on change son texte par celui qui est envoyé dans le body
*on enregistre
*/
module.exports.editCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        return PostModel.findById(
            req.params.id,
            (err, data) => {
                const theComment = data.comments.find((comment) =>
                    comment._id.equals(req.body.commentId)
                );

                if (!theComment) return res.status(404).send('Comment not found')
                theComment.text = req.body.text;

                return data.save((err) => {
                    if (!err) return res.status(200).send(data);
                    return res.status(500).send(err);
                });
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};

/* On cherche le post dans la base
*on utilise l'opérateur $pull pour retirer le commentaire, en lui précisant que c'est le commentaire qui à l'id passé dans le body 
*/
module.exports.deleteCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: {
                        _id: req.body.commentId
                    }
                }
            },
            { new: true },
            (err, data) => {
                if (!err) return res.send(data);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};