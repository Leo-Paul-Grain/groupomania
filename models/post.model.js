const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        posterId : {
            type: String,
            required: true
        },
        message: {
            type: String,
            trim: true,
            maxlength: 600
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
        comments: {                 //crée une sous base de données contenant les commentaires
            type: [
                {
                    commenterId: String,
                    commenterPseudo: String,
                    text: String,
                    timestamp: Number,
                }
            ],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('post', PostSchema);