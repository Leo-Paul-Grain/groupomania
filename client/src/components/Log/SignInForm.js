import React, { useState } from 'react';
import axios from "axios";


/*On récupère la valeur des inputs email et password et on les stocke dans leur useState
*Comme ça on peut s'en servir dans handleLogin pour faire notre requête avec Axios
*si le back renvoie des erreurs en data lors de la requête on les affiche avec innerHTML
*sinon on redirige vers la page Home
*/
const SignInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //useRef

    const handleLogin = (e) => {
        e.preventDefault();
        const authError = document.querySelector('.authError');

        axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}api/user/login`,
            withCredentials: true,
            data: {
                email,
                password,
            },
        })
            .then((res) => {
                if (res.data.errors) {
                    authError.innerHTML = res.data.errors;
                } else {
                    // Utiliser le history de react router dom
                    window.location = '/';
                }
            })
            .catch((err) => {
                console.log(err);
                // Afficher l'erreur
            });
    };
    
    return (
        <form action="" onSubmit={handleLogin} id="sign-up-form">
            <label htmlFor="email">Email</label>
            <br/>
            <input 
                type="text" 
                name="email" id="email" 
                onChange={(e) => setEmail(e.target.value)} value={email}/>
            <div className="authError"></div>
            <br />
            <label htmlFor="password">Mot de passe</label>
            <br />
            <input 
                type="password" 
                name="password" id="password" 
                onChange={(e) => setPassword(e.target.value)} value={password}/>
            <br />
            <input type="submit" value="Se connecter" />
        </form>
    );
};

export default SignInForm;