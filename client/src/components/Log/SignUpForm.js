import React, { useState } from 'react';
import axios from 'axios';
import SignInForm from './SignInForm';

const SignUpForm = () => {
    const [formSubmit, setFormSubmit] = useState(false);
    const [pseudo, setPseudo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [controlPassword, setControlPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        const pseudoError = document.querySelector('.pseudo.error');
        const emailError = document.querySelector('.email.error');
        const passwordError = document.querySelector('.password.error');
        const passwordConfirmError = document.querySelector('.password-confirm.error');

        //on injecte des strings vides à chaque fois qu'on relance le formulaire pour faire disparaitre les messages d'erreurs qui n'ont plus lieu d'être
        passwordConfirmError.innerHTML= "";

        if (password !== controlPassword) {
            passwordConfirmError.innerHTML = "Les mots de passe ne correspondent pas";
        } else {
            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}api/user/register`,
                data: {
                    pseudo,
                    email,
                    password,
                }
            })
            .then((res) => {
                if (res.data.errors) {
                    pseudoError.innerHTML = res.data.errors.pseudo;
                    emailError.innerHTML = res.data.errors.email;
                    passwordError.innerHTML = res.data.errors.password;
                } else {
                    setFormSubmit(true);
                }
            })
            .catch((err) => console.log(err)); //revoir cette erreur
        }
    };

    return (
        <>
            {formSubmit ? (
                <>
                <SignInForm />
                <h4 className="success">Inscription réussi, vous pouvez vous connecter</h4>
                </>
            ) : (
                <form action="" onSubmit={handleRegister} id="sign-up-form">
                    <label htmlFor="pseudo">Pseudo</label>
                    <br/>
                    <input 
                    type="text" 
                    name="pseudo" id="pseudo" 
                    onChange={(e) => setPseudo(e.target.value)} value={pseudo}/>
                    <div className="pseudo error"></div>
                    <br/>
                    
                    <label htmlFor="email">Email</label>
                    <br/>
                    <input 
                    type="text" 
                    name="email" id="email" 
                    onChange={(e) => setEmail(e.target.value)} value={email}/>
                    <div className="email error"></div>
                    <br/>
                    
                    <label htmlFor="password">Mot de passe</label>
                    <br/>
                    <input 
                    type="password" 
                    name="password" id="password" 
                    onChange={(e) => setPassword(e.target.value)} value={password}/>
                    <div className="password error"></div>
                    <br/>

                    <label htmlFor="password-conf">Confirmer le mot de passe</label>
                    <br/>
                    <input 
                    type="password" 
                    name="password" id="password-conf" 
                    onChange={(e) => setControlPassword(e.target.value)} value={controlPassword}/>
                    <div className="password-confirm error"></div>
                    <br/>

                    <input type="submit" value="Valider inscription" />
                </form>
            )}
        </>
    );
};

export default SignUpForm;