import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UploadImg from './UploadImg';
import { updateBio } from '../../feature/user.slice';
import { dateParser } from '../Utils';

const UpdateProfil = () => {
    const [bio, setBio] = useState('');
    const [updateForm, setUpdateForm] = useState(false); //pour afficher soit la bio quand false, soit l'input pour la modifier si true
    const userData = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    const handleUpdate = () => {
        dispatch(updateBio(userData._id, bio));
        setUpdateForm(false);
    };
    
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
                <div className='right-part'>
                    <div className='bio-update'>
                        <h3>Bio</h3>
                        {updateForm === false && (
                            <>
                                <p onClick={() => setUpdateForm(!updateForm)}>{userData.bio}</p>
                                <button onClick={() => setUpdateForm(!updateForm)}>Modifier bio</button>
                            </>
                        )}
                        {updateForm && (
                            <>
                                <textarea type="text" defaultValue={userData.bio} 
                                onChange={(e) => setBio(e.target.value)}>
                                </textarea>
                                <button onClick={handleUpdate}>Valider modifications</button>
                            </>
                        )}
                    </div>
                    <h4>Menbre depuis le : {dateParser(userData.createdAt)}</h4>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfil;