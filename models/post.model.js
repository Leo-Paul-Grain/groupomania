const mongoose = require('mongoose');

//Shema de commentaire -> CommentSchema

const CommentSchema = new mongoose.Schema(
    {
        commenterId: String,
        commenterPseudo: String,
        text: String
    },
    {
        timestamps: true,
    }
);

const PostSchema = new mongoose.Schema(
    {
        posterId : {
            type: String,
            required: true
        },
        message: {
            type: String,
            trim: true,
            maxlength: 1200
        },
        picture: {
            type: String,
        },
        video: {
            type: String
        },
        likers: {
            type: [String],
            required: true,
        },
        comments: [CommentSchema]
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('post', PostSchema);