const mongoose = require('mongoose');
const { isEmail } = require('validator'); //utilise la fonction isEmail de validator pour vérifier que c'est un e-mail valide, et renvoie true ou false
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        pseudo: {
            type: String, 
            required: true,
            minlength: 3,
            maxlength: 50,
            unique: true,
            trim: true //supprime les espaces placés en début et en fin de string
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6
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

/* on cherche le user dans la base d'après son email unique
*si on l'a trouvé on compare le hash du mot de passe de la requête avec le hash stocké dans la base
*si la comparaison est valide on return le user
*/
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email')
};

const UserModel = mongoose.model('user', userSchema);
module.exports = UserModel;