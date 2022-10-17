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
        }
    }