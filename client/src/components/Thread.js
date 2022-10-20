import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../feature/posts.slice";
import { isEmpty } from "./Utils";
import Card from "./Post/Card";

const Thread = () => {
    const [loadPost, setLoadPost] = useState(true);
    const [count, setCount] = useState(5);
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts.posts);

    //innerHeight retourne la hauteur totale d'un element(moins border et margin)
    //scrollTop renvoie le nombre de pixels qui a défilé
    //scrollingElement.scrollHeight est égale à la hauteur de ce qui est scrollable dans document
    //donc si innerheight + scrollTop est supérieur à scrollHeight c'est qu'on est arrivé en bas de page
    const loadMore = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 > document.scrollingElement.scrollHeight) {
            setLoadPost(true); //on relance le useEffect quand on arrive en bas de page pour charger plus de posts
        }
    }

    //on ne charge les posts que si loadPost est true, comme ça on le passe en false à la fin et on ne le fait qu'une fois
    useEffect(() => {
        if (loadPost) {
            dispatch(fetchPosts(count));
            setLoadPost(false)
            setCount(count + 5); //a chaque fois qu'on relance le useEffect on augmente le compteur pour charger plus de posts
        }
        //Lors d'un scroll on appelle la fonction loadMore qui analyse si on est à la fin de la page et si oui charge les posts suivants
        //ensuite on remove l'event listener
        window.addEventListener('scroll', loadMore);
        return () => window.removeEventListener('scroll', loadMore);
    }, [loadPost, dispatch, count])

    return (
        <div className="thread-container">
            <ul>
                {!isEmpty(posts[0]) && 
                    posts.map((posts) => {
                        return <Card posts={posts} key={posts._id}/>
                    })
                }
            </ul>
        </div>
    );
};

export default Thread;