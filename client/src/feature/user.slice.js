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
    },
});

export default userSlice.reducer;

//Action
const { setUserData } = userSlice.actions;

export const fetchUser = (uid) => async dispatch => {
    try {
        await axios
        .get(`${process.env.REACT_APP_API_URL}api/user/${uid}`)
        .then((res) => dispatch(setUserData(res.data)))
        } catch (err) {
            return console.log(err)
        }
    };