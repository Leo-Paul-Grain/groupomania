import React from 'react';
import { useSelector } from 'react-redux';
import UploadImg from './UploadImg';

const UpdateProfil = () => {
    const userData = useSelector((state) => state.user.user)
    
    return (
        <div className="profil-container">
            <h1>Profil de {userData.pseudo}</h1>
            <div className="update-container">
                <div className='left-part'>
                    <h3>Photo de profil</h3>
                    <img src={userData.picture} alt="profil-pic" />
                    <UploadImg />
                    <p>errors.maxSize</p>
                    <p>errors.format</p>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfil;