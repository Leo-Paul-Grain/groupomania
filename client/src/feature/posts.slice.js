import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//Posts Slice
export const postsSlice = createSlice({
    name: "posts",
    initialState: {
        posts: {},
    },
    reducers: {
        setPostsData: (state, action) => {
            state.posts = action.payload;
        },
        setPostMessage: (state, action) => {
                const post = state.posts.find((post) => post._id === action.payload.postId);
                if (!post) return
                else post.message = action.payload.message
        },
        setDeletePost: (state, action) => {
            state.posts = state.posts.filter((post) => post._id !== action.payload.postId)
        },
        setLike: (state, action) => {
            const post = state.posts.find((post) => post._id === action.payload.postId)
            post.likers.push(action.payload.userId)
        },
        setUnlike: (state, action) => {
            const post = state.posts.find((post) => post._id === action.payload.postId)
            post.likers = post.likers.filter((liker) => liker !== action.payload.userId)
        },
        setAddComment: (state, action) => {

        }
    },
});

export default postsSlice.reducer;

//Posts Actions
const { setPostsData, setPostMessage, setDeletePost, setLike, setUnlike, setAddComment } = postsSlice.actions;

//le paramètre "num" correspond au numéro passé par la variable "count" du component "Thread" afin de créer l'infinite scroll
//Ainsi on envoie un nombre limité (5) de posts dans notre store et il n'est pas surchargé
export const fetchPosts = (num) => async dispatch => {
    try {
        await axios
        .get(`${process.env.REACT_APP_API_URL}api/post`)
        .then((res) => {
            const array = res.data.slice(0, num)
            dispatch(setPostsData(array))
        })
        } catch (err) {
            return console.log(err) //notifier l'erreur au user
        };
    };

export const likePost = (postId, userId) => async dispatch => {
    try {
        await axios
        .patch(`${process.env.REACT_APP_API_URL}api/post/like-post/` + postId, { id: userId })
        .then((res) => {
            dispatch(setLike({ postId, userId }))
        })
    } catch (err) {
        return console.log(err)
    };
};

export const unlikePost = (postId, userId) => async dispatch => {
    try {
        await axios
        .patch(`${process.env.REACT_APP_API_URL}api/post/unlike-post/` + postId, { id: userId })
        .then((res) => {
            dispatch(setUnlike({ postId, userId }))
        })
    } catch (err) {
        return console.log(err)
    };
};

export const updatePost = (postId, message) => async dispatch  => {
    try {
        await axios
        .put(`${process.env.REACT_APP_API_URL}api/post/` + postId, { message }, { withCredentials: true })
        .then((res) => {
            dispatch(setPostMessage({postId, message}))
        })
    } catch(err) {
        return console.log(err)
    };
};

export const deletePost = (postId) => async dispatch => {
    try {
        await axios
        .delete(`${process.env.REACT_APP_API_URL}api/post/` + postId, { withCredentials: true })
        .then((res) => {
            dispatch(setDeletePost({postId}))
        })
    } catch(err) {
        return console.log(err)
    };
};

//Comments Actions

export const addComment = (postId, commenterId, text, commenterPseudo) => async dispatch => {
    try {
        await axios
        .patch(`${process.env.REACT_APP_API_URL}api/post/comment-post/` + postId, { commenterId, text, commenterPseudo }, { withCredentials: true })
        .then((res) => {
            dispatch(setAddComment({ postId }))
        })
    } catch(err) {
        return console.log(err)
    };
};