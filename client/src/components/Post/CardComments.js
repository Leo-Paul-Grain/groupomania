import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dateParser, isEmpty } from "../Utils";
import { addComment, fetchPosts } from "../../feature/posts.slice";

const CardComments = ({ posts }) => {
    const [text, setText] = useState("");
    const usersData = useSelector((state) => state.users.users);
    const userData = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    
    const handleComment = (e) => {
        e.preventDefault();

        if (text) {
            dispatch(addComment(posts._id, userData._id, text, userData.pseudo))
                .then(() => dispatch(fetchPosts())) //on recharge le store avec les posts pour récupérer le commentaire qui vient d'être créé
                .then(() => setText(""));
        }
    };

    return (
        <div className="comments-container">
            {posts.comments.map((comment) => {
                return (
                    <div className={comment.commenterId === userData._id ? "comment-container client" : "comment-container"} key={comment._id}>
                        <div className="left-part">
                            <img src={
                                !isEmpty(usersData[0]) && 
                                    usersData.map((user) => {
                                        if (user._id === comment.commenterId) return user.picture
                                        else return null
                                    }).join("")
                                }
                            alt="commenter-pic"/>
                        </div>
                        <div className="right-part">
                            <div className="comment-header">
                                <div className="pseudo">
                                    <h3>{comment.commenterPseudo}</h3>
                                </div>
                                <span>{dateParser(comment.createdAt)}</span>
                            </div>
                            <p>{comment.text}</p>
                        </div>
                    </div>
                )
            })}
            {userData._id && (
                <form action="" onSubmit={handleComment} className="comment-form">
                    <input type="text" name="text" 
                        onChange={(e) => setText(e.target.value)} 
                        value={text}
                        placeholder="Laisser un commentaire" />
                    <br/>
                    <input type="submit" value="Envoyer"/>
                </form>
            )}
        </div>
    );
};

export default CardComments;