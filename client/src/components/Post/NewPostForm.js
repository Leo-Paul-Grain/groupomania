import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, dateParser } from "../Utils";
import { NavLink } from "react-router-dom";
import { addPost, fetchPosts } from "../../feature/posts.slice";

const NewPostForm = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [postPicture, setPostPicture] = useState(null); //image qu'on affiche en front
    const [video, setVideo] = useState("");
    const [file, setFile] = useState(); //image que l'on envoie au back
    const userData = useSelector((state) => state.user.user);
    const errors = useSelector((state) => state.posts.errors);
    const dispatch = useDispatch();
    
    const handlePost = async () => {
        if (message || postPicture || video) {
            const data = new FormData();
            data.append('posterId', userData._id);
            data.append('message', message);
            if (file) data.append('file', file);
            data.append('video', video);

            await dispatch(addPost(data));
            dispatch(fetchPosts());
            cancelPost();
        } else {
            alert("Veuillez écrire un message")
        }
    };

    const handlePicture = (e) => {
        setPostPicture(URL.createObjectURL(e.target.files[0])) //permet la prévisualisation de l'image
        setFile(e.target.files[0]);
        setVideo('') //on post soit une image soit une vidéo
    };
    
    const cancelPost = () => {
        setMessage('');
        setPostPicture('');
        setVideo('');
        setFile('');
    };

    /*a chaque fois qu'on tombe sur un espace on split donc chaque chaines de caractère se retrouve dans un array
    *ensuite on cherche dans l'array le lien de la vidéo(la chaine de caractères qui contient un lien youtube)
    *si on l'a trouvé on remplace dans le lien watch par embed (sinon la vidéo n'est pas lisible end ehors de youtube)
    * on enlève aussi dans le lien tout ce qu'il y a après le '&' du lien pour que la vidéo commence bien au tout début
    * (& permet à youtube de faire démarrer une vidéo à un instant précis)
    * ensuite on enlève le lien de la vidéo de l'input texte en splitant
    * et on renvoie dans notre variable le message recomposer avec join pour que le reste apparaise dans l'input
    *si jamais l'utilisateur avait mis une photo avant de mettre la vidéo, on l'enlève
    */
    const handleVideo = () => {
        let findLink = message.split(" ");
        for (let i = 0; i < findLink.length; i++) {
            if (
                findLink[i].includes('https://www.youtube.com') || 
                findLink[i].includes('https://youtube.com')
                ) {
                    let embed = findLink[i].replace('watch?v=', 'embed/');
                    setVideo(embed.split('&')[0]);
                    findLink.splice(i, 1);
                    setMessage(findLink.join(" "))
                    setPostPicture('');
                }
        }
    };

    //on affiche un loading spinner le temps de récupérer les infos du user connecté
    useEffect(() => {
        if (!isEmpty(userData)) setIsLoading(false);
        handleVideo();
    }, [userData, message, video]);

    return (
        <div className="post-container">
            {isLoading ? (
                <i className="fas fa-spinner fa-pulse"></i>
            ) : (
                <>
                        <div className="user-info">
                        <NavLink to="/profil">
                            <img src={userData.picture} alt="user-pic" />
                        </NavLink>
                        </div>
                    
                    <div className="post-form">
                        <textarea 
                            name="message" id="message" placeholder="Que souhaitez vous partager ?"
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}/>
                            {message || postPicture || video.length > 20 ? (
                                <li className="card-container">
                                    <div className="card-left">
                                        <img src={userData.picture} alt="user-pic"/>
                                    </div>
                                    <div className="card-right">
                                        <div className="card-header">
                                            <div className="pseudo">
                                                <h3>{userData.pseudo}</h3>
                                            </div>
                                            <span>{dateParser(Date())}</span>
                                        </div>
                                        <div className="content">
                                            <p>{message}</p>
                                            <img src={postPicture} alt=""/>
                                            {video && (
                                                <iframe
                                                src={video}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                title={video}
                                              ></iframe>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ) : null}
                        <div className="footer-form">
                            <div className="icon">
                                {/*On check si l'utilisateur post une vidéo ou une photo car on n'autorise pas les deux en même temps*/}
                                {isEmpty(video) && (
                                    <>
                                        <img src="./img/icons/picture.svg" alt="post-pic"/>
                                        <input type="file" id="file-upload" name="file" accept=".jpg, .jpeg, .png" 
                                            onChange={(e) => handlePicture(e)}
                                        />
                                    </>
                                )}
                                {video && (
                                    <button onClick={() => setVideo('')}>Supprimer video</button>
                                )}
                            </div>
                            {!isEmpty(errors) && errors.includes("Extension de") && <p>{errors}</p>}
                            {!isEmpty(errors) && errors.includes("5 mo") &&<p>{errors}</p>}
                            <div className="btn-send">
                                {message || postPicture || video.length > 20 ? (
                                    <button className="cancel" onClick={cancelPost}>Annuler</button>
                                ) : null}
                                <button className="send" onClick={handlePost}>Envoyer</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NewPostForm;