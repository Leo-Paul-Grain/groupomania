import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: ' ',
    },
    reducers: {
        setUserData: (state, action) => {
            state.user = action.payload;
        },
        setPicture: (state, action) => {
            state.user.picture = action.payload;
        },
    },
});

export default userSlice.reducer;

//Actions
const { setUserData, setPicture } = userSlice.actions;

export const fetchUser = (uid) => async dispatch => {
    try {
        await axios
        .get(`${process.env.REACT_APP_API_URL}api/user/${uid}`)
        .then((res) => dispatch(setUserData(res.data)))
        } catch (err) {
            return console.log(err);
        };
    };

export const uploadPicture = (data, id) => async dispatch => {
    try {
        await axios
        .post(`${process.env.REACT_APP_API_URL}api/user/upload`, data)
        .then((res) => {
            return axios
                .get(`${process.env.REACT_APP_API_URL}api/user/${id}`)
                .then((res) => {
                    dispatch(setPicture(res.data.picture));
                });
        })
    } catch (err) {
        return console.log(err);
    };
};