import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../feature/posts.slice";
import { isEmpty } from "./Utils";
import Card from "./Post/Card";

const Thread = () => {
    const [loadPost, setLoadPost] = useState(true);
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts.posts);

    //on ne charge les posts que si loadPost est true, comme ça on le passe en false à la fin et on ne le fait qu'une fois
    useEffect(() => {
        if (loadPost) {
            dispatch(fetchPosts());
            setLoadPost(false)
        }
    }, [loadPost, dispatch])

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