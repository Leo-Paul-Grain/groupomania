import React, { useState } from 'react';
import axios from "axios";

const SignInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {

    }
    
    return (
        <form action="" onSubmit={handleLogin} id="sign-up-form">
            <label htmlFor="email">Email</label>
            <br/>
            <input type="text" name="email" id="email" 
                onChange={(e) => setEmail(e.target.value)} value={email}/>
            <input type="submit" value="Se connecter" />
        </form>
    );
};

export default SignInForm;