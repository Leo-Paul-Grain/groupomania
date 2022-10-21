import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost } from '../../feature/posts.slice';
import { dateParser, isEmpty } from '../Utils';
import DeleteCard from './DeleteCard';
import LikeButton from './LikeButton';

const Card = ({ posts }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdated, setIsUpdated] = useState(false);
    const [textUpdate, setTextUpdate] = useState(null);
    const usersData = useSelector((state) => state.users.users);
    const userData = useSelector((state) => state.user.user);
    const postsData = useSelector((state) => state.posts.posts);
    const dispatch = useDispatch();

    const updateItem = () => {
        if (textUpdate) {
            console.log(textUpdate)
            dispatch(updatePost(posts._id, textUpdate))
        }
        setIsUpdated(false);
    }

    //stop le loading spinner si postsData n'est pas vide (une fois que la data a été chargé dans le store)
    useEffect(() => {
        !isEmpty(postsData[0]) && setIsLoading(false);
    }, [postsData])

    return (
        <li className="card-container" key={posts._id}>
            {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
            ) : (
                <>
                <div className="card-left">
                    <img src={
                        !isEmpty(usersData[0]) && 
                            usersData.map((user) => {
                                if (user._id === posts.posterId) return user.picture
                                else return null
                            }).join("")
                        }
                    alt="poster-pic"/>
                </div>
                <div className="card-right">
                    <div className="card-header">
                        <div className="pseudo">
                            <h3>
                            {
                            !isEmpty(usersData[0]) && 
                            usersData.map((user) => {
                                if (user._id === posts.posterId) return user.pseudo
                                else return null
                            }).join("")
                            }
                            </h3>
                        </div>
                        <span>{dateParser(posts.createdAt)}</span>
                    </div>
                    {isUpdated === false && <p>{posts.message}</p>}
                    {isUpdated === true && (
                        <div className='update-post'>
                            <textarea 
                            defaultValue={posts.message}
                            onChange={(e) => setTextUpdate(e.target.value)}
                            />
                            <div className='button-container'>
                                <button className='btn' onClick={updateItem}>
                                    Valider modification
                                </button>
                            </div>
                        </div>
                    )}
                    {posts.picture && (
                        <img src={posts.picture} alt="card-pic" className="card-pic" />
                    )}
                    {posts.video && (
                        <iframe
                        width="500"
                        height="300"
                        src={posts.video}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={posts._id}
                      ></iframe>
                    )}
                    {userData._id === posts.posterId && (
                        <div className='button-container'>
                            <div onClick={() => setIsUpdated(!isUpdated)}>
                                <img src="./img/icons/edit.svg" alt="edit-icon"/>
                            </div>
                            <DeleteCard id={posts._id} />
                        </div>
                    )}
                    <div className="card-footer">
                        <div className="comment-icon">
                            <img src="./img/icons/message1.svg" alt="comments" />
                            <span>{posts.comments.length}</span>
                        </div>
                        <LikeButton posts={posts}/>
                    </div>

                </div>
                </>
            )}
        </li>
    )
};

export default Card;