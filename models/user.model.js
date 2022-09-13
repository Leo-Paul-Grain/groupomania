const mongoose = require('mongoose');
const { isEmail } = require('validator'); //utilise la fonction isEmail de validator pour vérifier que c'est un e-mail valide, et renvoie true ou false
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        pseudo: {
            type: String, 
            required: true,
            minLength: 3,
            maxLength: 50,
            unique: true,
            trim: true //supprime les espaces placés en début et en fin de string
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 6
        },
        picture: {
            type: String,
            default: './uploads/profil/random-user.png'
        },
        bio: {
            type: String,
        },
        postLiked: {
            type: [String]
        }
    },
    {
        timestamps: true,
    }
)

/*la méthode "pre" de mongoose permet d'appeller une fonction avant quelquechose, ici la sauvegarde dans la BDD ("save")
Ensuite on sale le mot de passe et on le passe à l'objet qui va être sauvegardé dans la base*/
userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

const UserModel = mongoose.model('user', userSchema);
module.exports = UserModel;