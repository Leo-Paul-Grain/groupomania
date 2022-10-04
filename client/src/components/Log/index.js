import React from 'react';
import { useState } from 'react';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';


/*On définit des useState true et false sur les bouton "s'inscrire" et se "connecter"
*Selon le useState on affiche le SignUpForm ou le SignInform
*lors du click sur ces boutons on change le use state afin d'afficher le bon composant
*on utilise aussi le usestate pour afficher la catégorie active en ajoutant une classe au bouton
*/
const Log = () => {
const [signUpModal, setSignUpModal] = useState(true);
const [signInModal, setSignInModal] = useState(false);

const handleModals = (e) => {
    if (e.target.id === "register") {
        setSignInModal(false);
        setSignUpModal(true);
    } else if (e.target.id === "login") {
        setSignUpModal(false);
        setSignInModal(true);
    }
}

    return (
        <div className="connection-form">
            <div className="form-container">
                <ul>
                    <li 
                        onClick={handleModals} 
                        id="register" 
                        className={signUpModal ? "active-btn" : null}>
                        S'inscrire
                    </li>
                    <li 
                        onClick={handleModals} 
                        id="login"
                        className={signInModal ? "active-btn" : null}>
                        Se connecter
                    </li>
                </ul>
                {signUpModal && <SignUpForm />}
                {signInModal && <SignInForm />}
            </div>
        </div>
    );
};

export default Log;