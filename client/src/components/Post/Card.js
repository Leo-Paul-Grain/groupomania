import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty } from '../Utils';

const Card = ({ posts }) => {
    const [isLoading, setIsLoading] = useState(true);
    const usersData = useSelector((state) => state.users.users);
    //const userData = useSelector((state) => state.user);
    const postsData = useSelector((state) => state.posts.posts);

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
                                if (user._id === posts.posterId) return user.picture;
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
                                if (user._id === posts.posterId) return user.pseudo;
                            }).join("")
                            }
                            </h3>
                        </div>
                        <span>{posts.createdAt}</span>
                    </div>
                    <p>{posts.message}</p>
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
                </div>
                </>
            )}
        </li>
    )
};

export default Card;