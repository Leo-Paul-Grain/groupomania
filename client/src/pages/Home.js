import React, { useContext } from 'react';
import Log from '../components/Log/index';
import { UidContext } from "../components/AppContext";
import Thread from '../components/Thread';
import NewPostForm from '../components/Post/NewPostForm';

const Home = () => {
    const uid = useContext(UidContext);
   
    //si uid existe (donc un user est connecté), on affiche la page, sinon on affiche le log pour qu'il se connecte
    return (
        <div className="home">
            {uid ? (
                <div className="main">
                    <div className='home-header'>
                    <NewPostForm />
                    </div>
                    <Thread />
                </div>
            ) : (
            <div className='login-page'>
                <div className="log-container">
                    <Log />
                    <div className="img-container">
                        <img src="./img/login.svg" alt="Login"/>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
};

export default Home;