import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//Posts Slice
export const postsSlice = createSlice({
    name: "posts",
    initialState: {
        posts: {},
        errors: [],
    },
    reducers: {
        setPostsData: (state, action) => {
            state.posts = action.payload;
        },
        setAddPost: (state, action) => {

        },
        setPostErrors: (state, action) => {
            state.errors = action.payload;
        },
        setPostMessage: (state, action) => {
                const post = state.posts.find((post) => post._id === action.payload.postId);
                if (!post) return
                else post.message = action.payload.message;
        },
        setDeletePost: (state, action) => {
            state.posts = state.posts.filter((post) => post._id !== action.payload.postId);
        },
        setLike: (state, action) => {
            const post = state.posts.find((post) => post._id === action.payload.postId);
            if (!post) return
            else post.likers.push(action.payload.userId);
        },
        setUnlike: (state, action) => {
            const post = state.posts.find((post) => post._id === action.payload.postId);
            if (!post) return
            else post.likers = post.likers.filter((liker) => liker !== action.payload.userId);
        },
        setAddComment: (state, action) => {

        },
        setEditComment: (state, action) => {
            const post = state.posts.find((post) => post._id === action.payload.postId);
            const comment = post.comments.find((comment) => comment._id === action.payload.commentId);
            if (!comment) return
            else comment.text = action.payload.text;
        },
        setDeleteComment: (state, action) => {
            const post = state.posts.find((post) => post._id === action.payload.postId);
            if (!post) return
            else post.comments = post.comments.filter((comment) => comment._id !== action.payload.commentId);
        }
    },
});

export default postsSlice.reducer;

//Posts Actions
const { setPostsData, setAddPost, setPostErrors, setPostMessage, setDeletePost, setLike, setUnlike, setAddComment, setEditComment, setDeleteComment } = postsSlice.actions;

//le paramètre "num" correspond au numéro passé par la variable "count" du component "Thread" afin de créer l'infinite scroll
//Ainsi on envoie un nombre limité (5) de posts dans notre store et il n'est pas surchargé
export const fetchPosts = (num) => async dispatch => {
    try {
        await axios
        .get(`${process.env.REACT_APP_API_URL}api/post`)
        .then((res) => {
            const array = res.data.slice(0, num)
            dispatch(setPostsData(array));
        })
        } catch (err) {
            return console.log(err) //notifier l'erreur au user
        };
    };

export const addPost = (data) => async dispatch => {
    try {
        await axios
        .post(`${process.env.REACT_APP_API_URL}api/post`, data)
        .then((res) => {
            dispatch(setAddPost());
            if (res.data.errors) {
                dispatch(setPostErrors(res.data.errors))
            }
        })
        } catch (err) {
            return console.log(err)
        };
};

export const likePost = (postId, userId) => async dispatch => {
    try {
        await axios
        .patch(`${process.env.REACT_APP_API_URL}api/post/like-post/` + postId, { id: userId }, { withCredentials: true })
        .then((res) => {
            dispatch(setLike({ postId, userId }));
        })
    } catch (err) {
        return console.log(err)
    };
};

export const unlikePost = (postId, userId) => async dispatch => {
    try {
        await axios
        .patch(`${process.env.REACT_APP_API_URL}api/post/unlike-post/` + postId, { id: userId }, {withCredentials: true })
        .then((res) => {
            dispatch(setUnlike({ postId, userId }));
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
            dispatch(setPostMessage({postId, message}));
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
            dispatch(setDeletePost({postId}));
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
            dispatch(setAddComment({ postId }));
        })
    } catch(err) {
        return console.log(err)
    };
};

export const editComment = (postId, commentId, text) => async dispatch => {
    try {
        await axios
        .patch(`${process.env.REACT_APP_API_URL}api/post/edit-comment-post/` + postId, { commentId, text }, { withCredentials: true })
        .then((res) => {
            dispatch(setEditComment({ postId, commentId, text }));
        })
    } catch(err) {
        return console.log(err)
    };
};

export const deleteComment = (postId, commentId) => async dispatch => {
    try {
        await axios
        .patch(`${process.env.REACT_APP_API_URL}api/post/delete-comment-post/` + postId, { commentId }, { withCredentials: true })
        .then((res) => {
            dispatch(setDeleteComment({ postId, commentId }));
        })
    } catch(err) {
        return console.log(err)
    };
}

//Posts Errors Slice (taille et format d'image)
export const postsErrorsSlice = createSlice({
    name: "postsErrors",
    initialState: {
        postsErrors: [],
    },
    reducers: {
        setPostErrors: (state, action) => {

        },
    },
});