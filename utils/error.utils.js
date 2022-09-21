/*La fonction signUpErrors est appellé dans le controlleurs signup si on catch 
*on lui passe l'erreur qu'on a attrapé
*On crée une variables errors contenant un objet avec les différents cas d'erreurs (vides pour l'instant)
*on regarde ce qui est contenu dans l'erreur pour savoir dans quel cas on est (ex: si la string en valeur de la clé "message" include le mot "pseudo")
*selon le cas on incrémente dans l'objet errors à la bonne clé le message d'erreur à renvoyer
*on return la variable errors qui contient désormais le messages à afficher
*/

module.exports.signUpErrors = (err) => {
    let errors = { pseudo: '', email: '', password: '' }

    if (err.message.includes('pseudo'))
        errors.pseudo = "Pseudo non valide"; 
    
    if (err.message.includes('email'))
        errors.email = "Email non valide";

    if (err.message.includes('password'))
        errors.password = 'Le mot de passe doit faire 6 caractères minimum';

/*le code d'erreur Mongo 11000 signifie qu'une valeur d'une clé de l'objet envoyé doit être unique mais qu'elle ne l'est pas
*ici on a 2 possibilités, c'est soit le pseudo soit l'email
*on doit donc vérifier ce qu'on a dans les keys de l'erreur renvoyé, ici c'est dans la première key qu'on aura "email" ou "pseudo"
*/
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('email'))
        errors.email = 'Un compte est déjà lié à cet email';
    
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo'))
        errors.pseudo = 'Ce pseudo est déjà pris par un autre utilisateur';

    return errors
};

/*La fonction suivante fonctionne de la même manière sauf sur un point :
*on renvoie le même message d'erreur dans les deux cas possible pour éviter de donner des informations sur nos utilisateurs
*Une personne malveillante ne doit pas pouvoir découvrir si l'email d'un utilisateur est dans notre base de données
*/
module.exports.signInErrors = (err) => {
    let errors = '';

    if (err.message.includes("email"))
        errors = "Paire email / mot de passe incorrecte";

    if (err.message.includes("password"))
        errors = "Paire email / mot de passe incorrecte";

    return errors
};

module.exports.uploadErrors = (err) => {
    let errors = { format: '', maxSize: '' };

    if (err.message.includes('invalid file'))
        errors.format = 'Format incompatible';

    if (err.message.includes('max size exceeded'))
        errors.maxSize = 'Le fichier dépasse 2mo';
    
    return errors
};