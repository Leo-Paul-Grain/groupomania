const postModel = require('../models/post.model');
const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.readPost = (req, res) => {
    PostModel.find((err, data) => {
        if (!err) res.send(data);
        else console.log('Error to get data : ' + err);
    })
}

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


