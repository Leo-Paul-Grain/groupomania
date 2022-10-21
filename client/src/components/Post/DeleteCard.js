import React from 'react';
import { useDispatch } from 'react-redux';
import { deletePost } from '../../feature/posts.slice';

const DeleteCard = (props) => {
    const dispatch = useDispatch();
    
    const deleteQuote = () => {
        dispatch(deletePost(props.id))
    }
    
    return (
        <div 
            onClick={() => {
                //envoie une alerte au user, si il confirme en cliquant sur ok on lance la suppression
                if (window.confirm('Voulez-vous vraiment supprimer ce post ?')) {
                    deleteQuote() 
                }
        }}>
            <img src='./img/icons/trash.svg' alt='delete' />
        </div>
    )
}

export default DeleteCard;