import React, { useContext } from 'react';
import Log from '../components/Log/index';
import { UidContext } from "../components/AppContext";
import Thread from '../components/Thread';

const Home = () => {
    const uid = useContext(UidContext);
   
    //si uid existe (donc un user est connecté), on affiche la page, sinon on affiche le log pour qu'il se connecte
    return (
        <div className="profil-page">
            {uid ? (
                <div className="main">
                    <Thread />
                </div>
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

export default Home;