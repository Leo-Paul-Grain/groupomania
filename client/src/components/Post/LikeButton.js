import React, { useContext, useEffect, useState } from "react";
import { UidContext } from "../AppContext";
import { likePost, unlikePost } from "../../feature/posts.slice";
import { useDispatch } from "react-redux";

/*Si le state liked est false on permet à l'utilisateur de liker le post (et une fois qu'il l'a fait on passe le state liked sur true)
*Si le state liked est true on lui permet de déliker (et si il il le fait on passe le state sur false)
*Par défaut liked est false mais si l'id du user se trouve dans l'array likers du post on le passe sur true
*/
const LikeButton = ({ posts }) => {
    const [liked, setLiked] = useState(false);
    const uid = useContext(UidContext);
    const dispatch = useDispatch();

    const like = () => {
        dispatch(likePost(posts._id, uid));
        setLiked(true);
    };

    const unlike = () => {
        dispatch(unlikePost(posts._id, uid));
        setLiked(false);
    };

    //on regarde si l'id du user est dans l'array likers du post, si il l'est on passe le state liked sur true
    useEffect (() => {
        if (posts.likers.includes(uid)) setLiked(true);
        else setLiked(false);
    }, [uid, posts.likers, liked])

    return (
        <div className="like-container">
           {uid && liked === false && (
            <img src="./img/icons/heart.svg" alt="like" 
            onClick={like}/>
           )}
           {uid && liked === true && (
            <img src="./img/icons/heart-filled.svg" alt="unlike" 
            onClick={unlike}/>
           )}
           <span>{posts.likers.length}</span>
        </div>
    );
};

export default LikeButton;