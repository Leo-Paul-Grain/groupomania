const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;
const jwt = require('jsonwebtoken');

module.exports.readPost = (req, res) => {
    PostModel.find((err, data) => {
        if (!err) res.send(data);
        else console.log('Error to get data : ' + err);
    }).sort({ createdAt: -1 }); //methode mongoose qui permet d'afficher les posts du plus récent au plus ancien (c'est l'inverse par défaut)
};

module.exports.createPost = async (req, res) => {
    const newPost = new PostModel({
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

    /*PostModel.updateOne({ _id: req.params.id, posterId: req.auth.userId }, { $set : updatedPost})
                    .then(() => res.status(200).json({message: "Post udpated"}))
                    .catch(error => res.status(401).json({ error })); */
    PostModel.findOne({_id: req.params.id})
        .then((post) => {
            if (req.auth.userId != post.posterId) {
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
        if (req.auth.userId != post.posterId) {
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
            {$addToSet: { likers: req.body.id }},
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
*on utilise la méthode updateOne avec un double filtre, on cherche d'abord le post d'apèrs l'id en param puis le commentaire avec l'id du body
*on update le champ avec la méthode set et l'opérateur positionnel $ qui identifie un élément d'un array sans qu'on est besoin de spécifier son index
*/
/*module.exports.editCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        return PostModel.updateOne(
           {_id: req.params.id, 'comments._id': req.body.commentId},
           {
            $set: {
                "comments.$.text": req.body.text
            }
           }
        )
        .then((data) => res.send(data))
        .catch((err) => res.status(400).send({ message: err }));
        
    } catch (err) {
        return res.status(400).send(err);
    }
};
*/

module.exports.editCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);
    
    //PostModel.findOne({ _id: req.params.id}, {comments: {$elemMatch: {_id: req.body.commentId}}})
    PostModel.findOne({ _id: req.params.id, "comments._id": req.body.commentId}, "comments.$")
    .then((theComment) => {
        if (req.auth.userId != theComment.comments[0].commenterId) { //idéalement je pourrais modifier theComment.comments[0].commenterId (pour comments.$.commenterId ?)
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
*on utilise l'opérateur $pull pour retirer le commentaire, en lui précisant que c'est le commentaire qui à l'id passé dans le body 
*/

module.exports.deleteCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    PostModel.findOne({ _id: req.params.id}, {comments: {$elemMatch: {_id: req.body.commentId}}})
    .then((theComment) => {
        if (req.auth.userId != theComment.comments[0].commenterId) { //idéalement je pourrais modifier theComment.comments[0].commenterId (pour comments.$.commenterId ?)
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