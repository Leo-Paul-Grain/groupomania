import React, { useContext } from 'react';
import Log from '../components/Log/index';
import { UidContext } from "../components/AppContext";

const Profil = () => {
    const uid = useContext(UidContext);

    return (
        <div className="profil-page">
            {uid ? (
                <h1>UPDATE PAGE</h1>
            ) : (
            <div className="log-container">
                <Log />
                <div className="img-container">
                    <img src="./img/login.svg" alt="Login"/>
                </div>
            </div>
            )}
        </div>
    );
};

export default Profil;