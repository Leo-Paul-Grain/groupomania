import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: ' ',
        errors: [],
    },
    reducers: {
        setUserData: (state, action) => {
            state.user = action.payload;
        },
        setPicture: (state, action) => {
            state.user.picture = action.payload;
        },
        setUserBio: (state, action) => {
            state.user.bio = action.payload;
        },
        setProfilErrors: (state, action) => {
            state.errors = action.payload;
        }
    },
});

export default userSlice.reducer;

//Actions
const { setUserData, setPicture, setUserBio, setProfilErrors } = userSlice.actions;

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
        .post(`${process.env.REACT_APP_API_URL}api/user/upload`, data, { withCredentials:true })
        .then((res) => {
            if (res.data.errors) {
                dispatch(setProfilErrors(res.data.errors));
            } else {
                dispatch(setProfilErrors([]));
                return axios
                    .get(`${process.env.REACT_APP_API_URL}api/user/${id}`, { withCredentials:true })
                    .then((res) => {
                        dispatch(setPicture(res.data.picture));
                    });
            }
        })
    } catch (err) {
        return console.log(err);
    };
};

export const updateBio = (userId, bio) => async dispatch => {
    try {
        await axios
        .put(`${process.env.REACT_APP_API_URL}api/user/` + userId, { bio }, { withCredentials:true })
        .then((res) => dispatch(setUserBio(res.data.bio)))
    } catch (err) {
        return console.log(err);
    };
};