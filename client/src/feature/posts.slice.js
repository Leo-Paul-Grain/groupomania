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
    },
});

export default postsSlice.reducer;

//Posts Action
const { setPostsData } = postsSlice.actions;

export const fetchPosts = () => async dispatch => {
    try {
        await axios
        .get(`${process.env.REACT_APP_API_URL}api/post`)
        .then((res) => dispatch(setPostsData(res.data)))
        } catch (err) {
            return console.log(err) //notifier l'erreur au user
        };
    };

//Like and Unlike Post n'utilise pas redux finalement (au départ je pensais en avoir besoin) 
//mais j'ai laissé les fonctions ici car ça me parait logique comme ce sont quand même des 
//actions liés aux posts
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