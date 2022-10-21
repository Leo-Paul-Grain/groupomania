import { createSlice, current } from "@reduxjs/toolkit";
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
                console.log(current(state.posts))
                const post = state.posts.find((post) => post._id === action.payload.postId);
                console.log(current(post))
                if (!post) return
                else post.message = action.payload.message
        }
    },
});

export default postsSlice.reducer;

//Posts Action
const { setPostsData, setPostMessage } = postsSlice.actions;

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

//Like and Unlike Post n'utilise pas redux finalement (au départ je pensais en avoir besoin) 
//mais j'ai laissé les fonctions ici car ça me parait logique comme ce sont quand même des actions liés aux posts
export const likePost = async (postId, userId) => {
    try {
        await axios
        .patch(`${process.env.REACT_APP_API_URL}api/post/like-post/` + postId, { id: userId })
    } catch (err) {
        return console.log(err)
    };
};

export const unlikePost = async (postId, userId) => {
    try {
        await axios
        .patch(`${process.env.REACT_APP_API_URL}api/post/unlike-post/` + postId, { id: userId })
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